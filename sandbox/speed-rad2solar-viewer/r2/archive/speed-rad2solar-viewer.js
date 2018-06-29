/* Copyright 2018 Ladybug Tools authors. MIT License */

	var rad = {};

	rad.meshes = null;
	rad.edges = null;
	rad.pointsField = null;
	rad.pointsGeometry = null;
	rad.opacity = 0.5;

	rad.colors = {

		InteriorWall: 0x008000,
		ExteriorWall: 0xFFB400,
		Roof: 0x800000,
		InteriorFloor: 0x80FFFF,
		ExposedFloor: 0x40B4FF,
		Shade: 0xFFCE9D,
		UndergroundWall: 0xA55200,
		UndergroundSlab: 0x804000,
		Ceiling: 0xFF8080,
		Air: 0xFFFF00,
		UndergroundCeiling: 0x408080,
		RaisedFloor: 0x4B417D,
		SlabOnGrade: 0x804000,
		FreestandingColumn: 0x808080,
		EmbeddedColumn: 0x80806E,

		generic_wall: 'gray',
		generic_floor: 'brown',
		generic_roof: 'maroon',


		Exterior_Window: 'black', //Exterior_Window ? Exterior_Window : 'black',
		Exterior_Wall: 'gray',
		Exterior_Floor: 'brown',
		Exterior_Roof: 'maroon',


		Ext_wall: 'gray',
		Floor: 'brown',
		Ext_glaz: 'black',
		Int_wall: 'navajowhite',
		Int_glaz: 'darkgray',
		Dark_Wood: 'brown',
		Ceiling: 'azure',
		Light_Wood: 'burlywood'

	};


	rad.parsePtsText = function( text ) {

		//console.log( 'text', text );
		if ( rad.pointsGeometry ) { rad.pointsGeometry.dispose(); };

		rad.pointsGeometry = new THREE.Geometry();

		const lines = text.split( /\r\n|\n/ )
		//console.log( 'lines', lines );

		const points = lines.map( item => item.split( /\s/).slice( 0, 3 ).map( str => parseFloat( str ) ) );
		//console.log( 'points', points );


		for ( let i = 0; i < points.length; i ++ ) {

			var point = new THREE.Vector3().fromArray( points[ i ] );

			rad.pointsGeometry.vertices.push( point );

			let arr = rad.vertexColors ? rad.vertexColors[ i ] : [ 0.8, 0.8, 0.8 ];

			rad.pointsGeometry.colors.push( new THREE.Color( arr[ 0 ], arr[ 1 ], arr[ 2 ] ) );

		}

		var pointsMaterial = new THREE.PointsMaterial( { size: 1.5, vertexColors: THREE.VertexColors } );
		pointsMaterial.sizeAttenuation = true;
		rad.pointsField = new THREE.Points( rad.pointsGeometry, pointsMaterial );

		scene.add( rad.pointsField );


		divLog.innerHTML =
		`
			<p>length: ${text.length.toLocaleString()}</p>
			<p>lines: ${lines.length}</p>

		`;


	}



	rad.parseResText = function( text ) {

		//console.log( 'text', text );

		const lines = text.split( /\r\n|\n/ )
		//console.log( 'lines', lines );

		rad.vertexColors = lines.map( item => item.split( /\s/).slice( 0, 3 ).map( str => parseFloat( str ) ) );

		//console.log( 'vertexColors', rad.vertexColors );

	}



	rad.parseRadText = function( text ) {

		const arr = location.hash.slice( 1 ).split( '/');
		const file = arr.pop();
		const path = arr.join( '/' );
		//console.log( 'path', path );

		const lines = text.split(/\r\n|\n/);
		//console.log( 'lines', lines );

		const items = [ 'header'];
		const data = [];
		let tmp = [];

		for ( let line of lines ) {

			line = line.trim();
			if ( line[0] === '#' ) { continue; }
			if ( line === '' ) { continue; }

			if ( line.search( /[abcdfghijklmnopqrstuvwxyz]/ ) >= 0 ) {

				if ( line.match( '!xform' ) && !line.match( '-rx' ) && !line.match( '-f' ) ) {

					let url = line.trim().replace( /  /g, ' ' ).split( /\s/)[ 1 ];
					url = url.slice( 1 );
					//console.log( 'path + url', path + url );

					rad.requestFile( path + url );

				} else {

					if ( line.match( 'void' ) ) {

						//console.log( 'void', line );

					}

				}

				items.push( line );
				data.push( tmp );
				tmp = [];

			} else {

				tmp.push( line );

			}

		}

		data.push( tmp );

		rad.items = items;
		rad.data = data;

		//console.log( 'rad', rad );

		rad.setVertices();

		divContents.innerHTML =
		`
			<p>length: ${text.length.toLocaleString()}</p>
			<p>lines: ${lines.length.toLocaleString()}</p>
			<p>faces: ${(items.length - 1).toLocaleString()}</p>
		`;

	};



	rad.setVertices = function() {

		for ( let i = 1; i < rad.items.length; i++ ) {

			//console.log( 'item', rad.items[ i ] );

			if ( rad.items[ i ] === '' ) {

				continue;

			} else if ( rad.items[ i ].includes( 'polygon') === true ) {
				//console.log( 'voided rad.items[ i ]', rad.items[ i ] );

				rad.drawPolygon( i );

			} else if ( rad.items[ i ].includes( 'void') ) {

				if ( rad.items[ i ].includes( 'brightfunc') || rad.items[ i ].includes( 'brighttext') || rad.items[ i ].includes( 'alias') ) {
					continue;
				}

				items = rad.items[ i ].trim().replace( /\t/g, ' ' ).replace( / {2,}/g, ' ' ).split( ' ' );
				//console.log( 'items', items );

				material = items[ 2 ];
				//console.log( 'material', material );

				arr = rad.data[ i ][ 2 ].trim().replace( /\t/g, ' ' ).replace( / {2,}/g, ' ' ).split( ' ' ).map( item => parseFloat( item ) );
				//console.log( 'rad.items', arr );

				color = new THREE.Color( arr[ 1 ], arr[ 2 ], arr[ 3 ]);
				//console.log( 'color', color );

				rad.colors[ material ] = color;

				continue;

			}
			//console.log( 'line', line );

		}

		scene.add( rad.meshes, rad.edges );
		zoomObjectBoundingSphere( rad.meshes );

	};



	rad.drawPolygon = function( i ) {

		const line = rad.data[ i ];
		const length = parseInt( line[ 2 ], 10 ) / 3 + 3;
		//console.log( 'length', length );

		const item = rad.items[ i ];

		let points = [];


		for ( let j = 3; j < length; j++ ) {

			//console.log( 'line', i, line[ i ]);

			const arr = line[ j ].trim().replace( /\t/g, ' ' ).replace( / {2,}/g, ' ' ).split( ' ' ).map( item => parseFloat( item ) );

			const vertex = new THREE.Vector3().fromArray( arr );
			//console.log( 'vertex', vertex );

			points.push( vertex );

		}

		if ( i === 7 ) {

			//points = [ points[ 0 ], points[ 1 ], points[ 3 ], points[ 2 ] ];
			//console.log( 'i=1 points', points );

		}

		if ( points.length > 9 ) {

			if ( points.length === 11 ) { // Michal's models

				//console.log( 'points', points );
				if ( points[ 4 ].z !== points[ 5 ].z ) {

					points = [ points[ 0 ], points[ 1 ], points[ 2 ], points[ 3 ], points[ 4 ],
						points[ 7 ], points[ 6 ], points[ 5 ], points[ 8 ], points[ 9 ], points[ 10 ] ];

					//console.log( 'points', points );

				}

			} else if ( points.length === 10 ) {

				/*
				if ( points[ 1 ].z !== points[ 2 ].z  ) {

					points = [ points[ 7 ], points[ 8 ], points[ 9 ], points[ 6 ], points[ 5 ],
						points[ 4 ], points[ 3 ], points[ 2 ], points[ 1 ], points[ 0 ] ];

					//console.log( 'points', points );

				}
				*/


			}

		} else {

			//return;

		}


		if ( points.length === 0 ) {

			//continue;

		} else {

			colorText = rad.items[ i ].split( ' ' )[0];
			//console.log( 'colorText', colorText );

			color = rad.colors[ colorText ];
			color = color ? color : 'darkgray';

			bbox = new THREE.Box3().setFromPoints( points );

			//console.log( 'bbox', bbox.getSize() );

			texture = new THREE.TextureLoader().load( "../test-cases/test-case-1/0_0_0_0_0_1.bmp");
			//console.log( 'tt', texture );

			texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

			texture.offset.x = 0.5;
			texture.offset.y = 0.5;
			material = new THREE.MeshBasicMaterial( { color: 0xffffff, map: texture, opacity: rad.opacity, side: 2, transparent: true } );

			const shape = rad.get3dShape( points, material );

			texture.repeat.set(  1 / shape.userData.size.x, 1 / shape.userData.size.y );

			const edgesGeometry = new THREE.EdgesGeometry( shape.geometry );
			const surfaceEdge = new THREE.LineSegments( edgesGeometry, new THREE.LineBasicMaterial( { color: 0x333333 } ) );
			surfaceEdge.rotation.copy( shape.rotation );
			surfaceEdge.position.copy( shape.position );

			rad.meshes.add( shape );
			rad.edges.add( surfaceEdge );

		}

	};



	/////

	rad.get3dShape = function( vertices, material, holes = [] ) {

		// 2018-06-02

		const plane = getPlane( vertices );

		const referenceObject = new THREE.Object3D();
		referenceObject.lookAt( plane.normal ); // copy the rotation of the plane
		referenceObject.quaternion.conjugate(); // figure out the angle it takes to rotate the vertices so they lie on the XY plane
		referenceObject.updateMatrixWorld();

		vertices.map( vertex => referenceObject.localToWorld( vertex ) );

		const holeVertices = [];

		for ( let verticesHoles of holes ) {

			const hole = new THREE.Path();

			verticesHoles.map( vertex => referenceObject.localToWorld( vertex ) );

			hole.setFromPoints( verticesHoles );

			holeVertices.push( hole );

		}

		const bbox = new THREE.Box2().setFromPoints( vertices );
		const size = bbox.getSize( new THREE.Vector2() );
		//console.log( 'size', size );

		const shapeMesh = get2DShape( vertices, material, holeVertices );
		shapeMesh.userData.size = size;

		shapeMesh.lookAt( plane.normal );
		const center = plane.coplanarPoint( new THREE.Vector3() );
		shapeMesh.position.copy( center );

		return shapeMesh;

		//

			function get2DShape( vertices, material, holes = [] ) {

				const shape = new THREE.Shape( vertices );
				shape.holes = holes;
				const geometryShape = new THREE.ShapeGeometry( shape );
				const shapeMesh = new THREE.Mesh( geometryShape, material );
				return shapeMesh;

			}


			function getPlane ( points, start = 0 ) {

				const triangle = new THREE.Triangle();
				triangle.set( points[ start ], points[ start + 1 ], points[ start + 2 ] );

				if ( triangle.getArea() === 0 ) { // points must be colinear therefore not usable

					start++;
					getPlane( points, start );

				}

				const pl = new THREE.Plane();
				const plane = triangle.getPlane( pl );

				return plane;

			}

	};




	rad.requestFile = function( url ) {

		//scene.remove( rad.meshes, rad.edges );
		//rad.meshes = new THREE.Object3D();
		//rad.edges = new THREE.Object3D();

		const xhr = new XMLHttpRequest();
		xhr.crossOrigin = 'anonymous';
		xhr.open( 'GET', url, true );
		xhr.onerror = function( xhr ) { console.log( 'error:', xhr  ); };
		//xhr.onprogress = function( xhr ) { console.log( 'bytes loaded:', xhr.loaded ); }; /// or something
		xhr.onload = rad.requestFileCallback;
		xhr.send( null );

	};



	rad.requestFileCallback = function( xhr ) {

		//console.log( 'xhr', xhr );

		const type = xhr.target.responseURL.slice( -3 ).toLowerCase();

		if ( type === 'rad' ){

			const response = xhr.target.response;
			//console.log( 'response', xhr );

			rad.parseRadText( response );

		} else if ( type === 'pts' ) {

			const response = xhr.target.response;
			//console.log( 'pts response', xhr );

			rad.parsePtsText( response );

		} else if ( type === 'res' ) {

			const response = xhr.target.response;
			//console.log( 'res response', xhr );

			rad.parseResText( response );

		}

	}