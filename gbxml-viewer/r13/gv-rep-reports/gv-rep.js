/*
global THR, THREE, GBP, GBI,window, document,butSettings, detSettings,divMenuItems,rngOpacity,rngViewExplodeVertical
*/
/* jshint esversion: 6 */

// Copyright 2018 Ladybug Tools authors. MIT License

	var REP = {};

	REP.initRep = function () { // call ed bottom of file

		if ( window.butMenuLoad ) {

			REP.butMenuReports = butMenuLoad;

			REP.title = 'gv-REP - gbXML Viewer Rep';
			document.title = REP.title;
			aDocumentTitle.innerHTML = REP.title;
			REP.butMenuReports.innerHTML = REP.title;

		} else {

			divPopUp.style.display = 'none';
			REP.butMenuReports = butMenuReports;

		}

		if ( REP.butMenuReports.style.fontStyle !== 'italic' ) {

			divMenuItems.innerHTML = REP.getMenuItems();

			REP.setMenuItems();

			REP.butMenuReports.style.cssText = 'background-color: pink !important; font-style: italic; font-weight: bold';

			const butts = divMenuItems.getElementsByTagName( "button" );
			//console.log( 'butts', butts );

			for ( let butt of butts ) {

				butt.classList.add( "w3-theme-d1", "w3-hover-theme", "w3-hover-border-theme" );

			}

		} else {

			//divMenuItems.remove();
			divMenuItems.innerHTML = '';

			REP.butMenuReports.style.backgroundColor = '';
			REP.butMenuReports.style.fontStyle = '';
			REP.butMenuReports.style.fontWeight = '';

		}


		THR.controls.autoRotate = false;
		THR.controls.keys = false;

	};



	REP.getMenuItems = function(){

		let txt =
		`<details id = "detReports" class = "app-menu" open >

			<summary>Reports</summary>

			<div id=REPdivMenuPanelPrelims ></div>

			<div id=REPdivMenuPanelSelectReport ></div>

			<div id=REPdivMenuPanelSurfacesByType ></div>

			<div id=REPdivMenuPanelOpeningsByType ></div>

			<div id=REPdivMenuPanelCadObjectsByType ></div>

			<hr>

			<!-- could move to GBI -->

			<details >
				<summary>gbXML Attributes</summary>
				<div id=REPdivGbxmlAttributes ></div>
				<hr>
			</details>

			<details >
				<summary>Campus</summary>
				<div id=REPdivCampus ></div>
				<hr>
			</details>

			<details >
				<summary id=REPsumCampusLocation >Campus Location</summary>
				<div id=REPdivCampusLocation ></div>
				<hr>
			</details>

			<details >
				<summary>Building</summary>
				<div id=REPdivCampusBuilding ></div>
			</details>

			<p>
				<small><i>Want reports on more gbXML elements? <br><a href="https://github.com/ladybug-tools/spider/issues" >Just shout</a> and they will appear.</i></small>
			</p>

			<hr>

		</details>`;

		return txt;

	};



	REP.setMenuItems = function() {

		REP.reportTypes = [];  // better name

		//REPdivMenuPanelPrelims.innerHTML = REP.getPanelVisibilityToggle();

		REPdivMenuPanelPrelims.innerHTML = GBI.getPanelShowHide();

		REPdivMenuPanelSelectReport.innerHTML = REP.getPanelSelectReport();
		//console.log( 'REPselReport', REPselReport );

		let txt = REP.getPanelSelectOptions( GBP.gbjson.Campus.Surface, 'Surface' );

		txt += REP.getPanelSelectOptions( GBP.gbjson.Campus.Building.Space, 'Space' );
		//REP.getMenu( GBP.gbjson.Campus.Building.Space, 'Space' );

		txt += REP.getPanelSelectOptions( GBP.gbjson.Campus.Building.BuildingStorey, 'Storey' );
		//REP.getMenu( GBP.gbjson.Campus.Building.BuildingStorey, 'Storey' );

		txt += REP.getPanelSelectOptions( GBP.gbjson.Zone, 'Zone' );
		//REP.getMenu( [ GBP.gbjson.Zone ], 'Zone' );

		txt += REP.getPanelSelectOptionsOpenings();

		REPselReport.innerHTML = txt;
		///

		REP.setMenuPanelSurfacesByType( REPdivMenuPanelSurfacesByType );

		REP.setMenuPanelOpeningsByType( REPdivMenuPanelOpeningsByType );

		//REPdivMenuPanelCadObjectsByType.innerHTML = REP.getMenuPanelCadObjectsByType();
		REP.setMenuPanelCadObjectsByType( REPdivMenuPanelCadObjectsByType );

		///

		//REPdivGbxmlAttributes.innerHTML = REP.getGbjsonAttributes( GBP.gbjson );
		GBI.setGbjsonAttributes( GBP.gbjson, REPdivGbxmlAttributes );

		//REPdivCampus.innerHTML = REP.getGbjsonAttributes( GBP.gbjson.Campus );
		GBI.setGbjsonAttributes( GBP.gbjson.Campus, REPdivCampus );

		//REPdivCampusLocation.innerHTML = REP.getGbjsonAttributes( GBP.gbjson.Campus.Location );
		GBI.setGbjsonAttributes( GBP.gbjson.Campus.Location, REPdivCampusLocation);

		const mapLink = REP.getGoogleMap();
		REPsumCampusLocation.innerHTML += mapLink;

		//REPdivCampusBuilding.innerHTML = REP.getGbjsonAttributes( GBP.gbjson.Campus.Building );
		GBI.setGbjsonAttributes( GBP.gbjson.Campus.Building, REPdivCampusBuilding );

	};



	// init Select Report details panel

	REP.getPanelSelectReport = function() {

		const reports =

		`<details open >

				<summary>Select Report</summary>

				<div>
					<select id=REPselReport onclick=REP.setPanelReport(); onchange=REP.setPanelReport(); size=10 ></select>
				</div>

				<div id=REPdivReport ></div>

				<div id=REPdivInteract ></div>

		</details>

		<hr>`;

		return reports;

	};



	REP.getPanelSelectOptions = function( parent, element ) {

		const obj = Array.isArray( parent ) ? parent[ 0 ] : parent; // [parent[ 0 ] : parent;
		// what about others in array?

		let options = '';

		for ( let property in obj ) {

			if ( obj[ property ] !== null && typeof( obj[ property ] ) === 'object' ) {

				//if ( elements.indexOf( property ) < 0 ) { elements.push( property ); }
			} else {

				const item = {};

				item.attribute = property;
				item.divAttributes = 'REPdivElementAttributes';

				item.parent = parent;
				item.element = element;
				item.placeholder = property;
				item.selItem = 'REPselReportType';

				REP.reportTypes.push( item );

				options += '<option value=' + property + ' >' + element + ' by ' + property + '</option>';

			}

		}

		return options;

	};



	REP.getPanelSelectOptionsOpenings = function() {

		REP.SurfacesWithOpenings = GBP.surfaceJson.filter( surface => surface.Opening );
		//console.log( 'REP.SurfacesWithOpenings', REP.SurfacesWithOpenings );

		REP.openings = [];

		for ( let surface of REP.SurfacesWithOpenings ) {

			if ( surface.Opening.length ) {

				REP.openings.push ( ...surface.Opening );

			} else {

				REP.openings.push ( surface.Opening );

			}

		}
		//console.log( 'REP.openings', REP.openings );

		return REP.getPanelSelectOptions( REP.openings, 'Openings' );

	};



	REP.setPanelReport = function() {

		let item = REP.reportTypes[ REPselReport.selectedIndex ];
		//console.log( 'item', item );

		REPdivReport.innerHTML =

		`<div>

			<p><b>` + item.element + ' by ' + item.attribute + ' &raquo; ' + item.parent.length + ` items</b><br></p>

			<div id=REPdivElements ></div>

		</div>`;

		let arr = Array.isArray( item.parent ) ? item.parent : [ item.parent ];

		item.optionValues = arr.map( element => [ element[ item.attribute ], element.id ] );

		item.optionValues.sort( ( a, b ) => {
			if ( a[ 0 ] === b[ 0 ] ) { return 0; } else { return ( a[ 0 ] < b[ 0 ] ) ? -1 : 1; }
		} );
		//console.log( 'item.optionValues', item.optionValues );

		item.divTarget = document.getElementById( 'REPdivElements' );
		//console.log( 'item', item );

		GBI.setElementPanel2( item );

		REP.setPanelInteractions();

	};


	/////

	REP.setMenuPanelSurfacesByType = function( target ) {

		const surfaces = GBP.gbjson.Campus.Surface;

		let txt = '';
		const types = [];
		const typesCount = [];

		for ( let surface of surfaces ) {

			const index = types.indexOf( surface.surfaceType );

			if ( index < 0 ) {

				types.push( surface.surfaceType );
				typesCount[ types.length - 1 ] = 1;

			} else {

				typesCount[ index ] ++;

			}

		}

		for ( let i = 0; i < types.length; i++ ) {

			txt +=
				`<button class=toggleView onclick=REP.setSurfaceTypeInvisible(this) value=` +
					types[ i ] +
					`><img src="../assets/eye.png" height=18></button>
					<button class=toggle onclick=REP.setSurfaceTypeVisible(this.innerText); >` +
					types[ i ] +
					`</button>: ` +
					typesCount[ i ] + '-' + Math.round( 100 * typesCount[ i ] / surfaces.length ) +
				`'%<br>`;

		}

		const details =

		`<details >

			<summary >Surfaces by Type &raquo; ` + types.length + `</summary>

			<div>` + txt +
				`<p><button class=toggle onclick=REP.setExposedToSunVisible(); >Exposed to Sun</button> </p>
				<p><button class=toggle onclick=GBP.setAllVisible(); >all visible</button></p>
			</div>

		</details>`;

		target.innerHTML = details;

	};



	REP.setMenuPanelOpeningsByType = function( target ) {

		const types = [];

		for ( let opening of REP.openings ) {

			if ( !opening.openingType ) { continue; }

			const type = opening.openingType;

			if ( !types.includes( type ) ) {

				types.push( type);

			}

		}

		types.sort();

		let txt = '';

		for ( let type of types ){

			txt += '<option>' + type + '</option>';

		}

		const details =

		`<details >

			<summary>Openings by Type &raquo; ` + types.length + `</summary>

			<p>
				<select id = "REPselOpeningsByType" onclick=REP.setOpeningTypeVisible(this.value);
					onchange=REP.setOpeningTypeVisible(this.value); size=` + types.length + ` >` +
					txt +
				`</select>
			</p>

		</details>`;

		target.innerHTML = details;

	};



	REP.setMenuPanelCadObjectsByType = function( target ) {

		const surfaces = GBP.gbjson.Campus.Surface;
		const cadIds = [];
		let contents = '';

		for ( let surface of surfaces ) {

			if ( !surface.CADObjectId ) { continue; }

			const id = surface.CADObjectId.replace( /\[(.*?)\]/gi, '' );

			if ( !cadIds.includes( id ) ) {

				cadIds.push( id );

			}

		}

		cadIds.sort();

		let txt = '';

		for ( let id of cadIds ){

			txt += '<option>' + id + '</option>';

		}

		const details =

		`<details>

			<summary >CAD Objects by Type &raquo; ` + cadIds.length + `</summary>

			<p>
				<select id = "REPselCadIdGroups" onclick=REP.setCadObjectTypeVisible(this.value);
					onchange=REP.setCadObjectTypeVisible(this.value); size=10 >` +
					txt +
				`</select>
			</p>

		</details>`;

		target.innerHTML = details;

	};



	/////

	REP.xxxxsetPanelAttributes = function() {

		//type = REPselReport.value;
		const typeItem = REP.reportTypes[ REPselReport.selectedIndex ];
		//console.log( 'typeItem', typeItem );

		const itemId = REPselItem.value;
		//console.log( 'itemId', itemId);

		let item = typeItem.gbjson.find( element => element.id === itemId );
		//console.log( 'item', item );

		const attributes = REP.getGbjsonAttributes( item );
		REPdivAttributes.innerHTML = ( REPselItem.selectedIndex + 1 ) + '.<br>' + attributes;
		//console.log( 'ell', REP.getGbjsonAttributes( item ).elements );

		switch( typeItem.element ) {

			case 'Surface':
				REP.setSurfaceVisible( REPselItem.value );
				break;
			case 'Space':
				REP.setSpaceVisible(REPselItem.value);
				break;
			case 'Storey':
				REP.setStoreyVisible(REPselItem.value);
				break;
			case 'Zone':
				REP.setZoneVisible(REPselItem.value);
				break;
			case 'Openings':
				REP.setOpeningVisible( REPselItem.value );
				const points = item.PlanarGeometry.PolyLoop.CartesianPoint.map( CartesianPoint => new THREE.Vector3().fromArray( CartesianPoint.Coordinate ) );
				//console.log( 'points', points.length )

				REPdivAttributes.innerHTML += '<br>Vertices: ' + points.length;
				break;
			default:

		}

	};



	REP.setPanelInteractions = function() {

		const item = REP.reportTypes[ REPselReport.selectedIndex ];
		//console.log( 'item', item );

		if ( item.element === 'Surface' ) {

			REPdivInteract.innerHTML =
			`
				<button onclick=GBI.setSurfaceVisible(REPselReportType.value); class="app-menu w3-theme-d1 w3-hover-theme w3-hover-border-theme" >select</button>
				<button onclick=GBI.setSurfaceZoom(REPselReportType.value); class="app-menu w3-theme-d1 w3-hover-theme w3-hover-border-theme" >zoom</button>
			`;

		} else if ( item.element === 'Space' ) {

			REPdivInteract.innerHTML =
			`
				<button onclick=GBI.setSpaceVisible(REPselReportType.value); class="app-menu w3-theme-d1 w3-hover-theme w3-hover-border-theme" >select</button>
				`;

//				<button onclick=GBI.setSurfaceZoom(REPselReportType.value); class="app-menu w3-theme-d1 w3-hover-theme w3-hover-border-theme">zoom</button>
		} else if ( item.element === 'Storey' ) {

			REPdivInteract.innerHTML =
			`
				<button onclick=GBI.setStoreyVisible(REPselReportType.value); class="app-menu w3-theme-d1 w3-hover-theme w3-hover-border-theme" >select</button>
			`;

		}else if ( item.element === 'Zone' ) {

			REPdivInteract.innerHTML =
			`
				<button onclick=GBI.setZoneVisible(REPselReportType.value); class="app-menu w3-theme-d1 w3-hover-theme w3-hover-border-theme" >select</button>
			`;

		} else if ( item.element === 'Openings' ) {

			REPdivInteract.innerHTML =
			`
				<button onclick=GBI.setOpeningVisible(REPselReportType.value); class="app-menu w3-theme-d1 w3-hover-theme w3-hover-border-theme" >select</button>
			`;

		}

	};



	///// individual elements

	REP.xxxsetSurfaceVisible = function( id ) {

		GBP.surfaceMeshes.children.forEach( element => element.visible = element.userData.data.id === id ? true : false );

	};



	REP.setCadObjectIdVisible = function( CadId ) {

		GBP.surfaceMeshes.children.forEach( element => element.visible = element.userData.data.CADObjectId === CadId ? true : false );

	};



	REP.setSpaceVisible = function( id ) {
		//console.log( 'id', id );

		GBP.surfaceMeshes.visible = true;
		GBP.openingMeshes.visible = false;

		for ( let child of GBP.surfaceMeshes.children ) {

			child.visible = false;

			const adjacentSpaceId = child.userData.data.AdjacentSpaceId;
			//console.log( 'adjacentSpaceId', adjacentSpaceId );

			if ( adjacentSpaceId && adjacentSpaceId.spaceIdRef && id === adjacentSpaceId.spaceIdRef ) {

				child.visible = true;

			} else if ( Array.isArray( adjacentSpaceId ) === true ) {

				if ( id === adjacentSpaceId[ 0 ].spaceIdRef || id === adjacentSpaceId[ 1 ].spaceIdRef ) {

					child.visible = true;

				}

			}

		}

	};



	REP.setStoreyVisible = function( id ) {

		//console.log( 'id', id );

		const spaces = GBP.gbjson.Campus.Building.Space;

		GBP.surfaceMeshes.children.forEach( element => element.visible = false );

		for ( let child of GBP.surfaceMeshes.children ) {

			adjacentSpaceId = child.userData.data.AdjacentSpaceId;

			if ( !adjacentSpaceId ) { continue; }

			spaceIdRef = Array.isArray( adjacentSpaceId ) ? adjacentSpaceId[ 1 ].spaceIdRef : adjacentSpaceId.spaceIdRef;

			spaces.forEach( element => child.visible = element.id === spaceIdRef && element.buildingStoreyIdRef === id ? true : child.visible );

		}

		//const storey = GBP.gbjson.Campus.Building.BuildingStorey.find( function( item ) { return item.id === id; } );
		//console.log( 'storey', storey );

	};



	REP.setZoneVisible = function ( zoneIdRef ) {

		//console.log( 'zoneIdRef', zoneIdRef );

		const spaces = GBP.gbjson.Campus.Building.Space;

		GBP.surfaceMeshes.children.forEach( element => element.visible = false );

		for ( let child of GBP.surfaceMeshes.children ) {

			adjacentSpaceId = child.userData.data.AdjacentSpaceId;
			//console.log( 'adjacentSpaceId', adjacentSpaceId );

			if ( !adjacentSpaceId ) { continue; }

			spaceIdRef = Array.isArray( adjacentSpaceId ) ? adjacentSpaceId[ 1 ].spaceIdRef : adjacentSpaceId.spaceIdRef;

			spaces.forEach( element => child.visible = element.id === spaceIdRef && element.zoneIdRef === zoneIdRef ? true : child.visible );

		}

		let zone;

		if ( Array.isArray( GBP.gbjson.Zone ) ) {

			zone = GBP.gbjson.Zone.find( function( item ) { return item.id === zoneIdRef; } );

		} else {

			zone = GBP.gbjson.Zone;

		}

		//console.log( 'zone', zone );

	};



	REP.setOpeningVisible = function( id ) {

		//console.log( 'opening id', id );

		GBP.surfaceMeshes.visible = false;
		GBP.openingMeshes.visible = true;

		GBP.openingMeshes.children.forEach( element => {

			element.visible = element.userData.data.id === id ? true : false;

			if ( element.visible === true  ) {

				element.material.opacity = 1;
				element.material.side = 2;
				element.material.needsUpdate = true;

			}

		} );

	};


	///// types

	REP.setSurfaceTypeVisible = function( type ) {

		GBP.surfaceMeshes.children.forEach( element => element.visible = element.userData.data.surfaceType === type? true : false );

	};



	REP.setOpeningTypeVisible = function( type ) {

		GBP.surfaceEdges.visible = false;
		GBP.surfaceMeshes.visible = false;
		GBP.openingMeshes.children.forEach( element => element.visible = element.userData.data.openingType === type? true : false );

	};



	REP.setCadObjectTypeVisible = ( CADObjectGroupId ) => {
		//console.log( 'CADObjectGroupId', CADObjectGroupId);

		GBP.surfaceEdges.visible = true;

		for ( let child of GBP.surfaceMeshes.children ) {

			child.visible = false;

		}

		for ( let child of GBP.surfaceMeshes.children ) {

			if ( !child.userData.data.CADObjectId ) { continue; }

			id = child.userData.data.CADObjectId.replace( /\[(.*?)\]/gi, '' ) ;
			if ( id.includes( CADObjectGroupId ) ) {

				child.visible = true;

			} else {

				child.visible = false;

			}

		}

	};



	REP.setExposedToSunVisible = function(  ) {

		GBP.surfaceMeshes.children.forEach( element => element.visible = element.userData.data.exposedToSun === "true" ? true : false );

	};



	REP.setSurfaceTypeInvisible = function( that ) {

		that.style.backgroundColor = that.style.backgroundColor === 'lightblue' ? '' : 'lightblue';

		for ( let child of GBP.surfaceMeshes.children ) {

			if ( !child.userData.data ) { continue; }

			if ( child.userData.data.surfaceType === that.value && that.style.backgroundColor === 'lightblue' ) {

				child.visible = false;

			} else if ( child.userData.data.surfaceType === that.value ) {

				child.visible = true;

			}

		}

	};



	/////

	// write a zoom to array of surfaces / make work for all types of things

	REP.zoomIntoSurface = function( id ) {
		//console.log( 'id', id );

		const surfaceMesh = GBP.surfaceMeshes.children.find( element => element.userData.data.id === id );
		//console.log( '', surfaceMesh );

		const center = surfaceMesh.localToWorld( surfaceMesh.geometry.boundingSphere.center.clone() );
		//console.log( 'center * radius', center, radius );
		const radius = surfaceMesh.geometry.boundingSphere.radius > 1 ? surfaceMesh.geometry.boundingSphere.radius : 1;

		THR.scene.remove( REP.telltale );
		const geometry = new THREE.BoxGeometry( 0.1, 0.1, 0.1 );
		const material = new THREE.MeshNormalMaterial( { opacity: 0.7, transparent: true } );
		REP.telltale = new THREE.Mesh( geometry, material );
		REP.telltale.position.copy( center );
		THR.scene.add( REP.telltale );

		THR.controls.target.copy( center );
		THR.camera.position.copy( center.clone().add( new THREE.Vector3( 3.0 * radius, - 3.0 * radius, 3.0 * radius ) ) );

	};



	REP.setZoomToSpace = function( id ) {

		//surfaceGroup.visible = true;
		//icw.divLog.innerHTML = '';

		for ( let child of GBP.surfaceMeshes.children ) {

			if ( !child.userData.data ) { continue; }

			child.visible = false;

			adjacentSpaceId = child.userData.data.AdjacentSpaceId;

			if ( adjacentSpaceId && adjacentSpaceId.spaceIdRef && id === adjacentSpaceId.spaceIdRef ) {

				child.visible = true;

			} else if ( Array.isArray( adjacentSpaceId ) === true ) {

				if ( id === adjacentSpaceId[ 0 ].spaceIdRef || id === adjacentSpaceId[ 1 ].spaceIdRef ) {

					child.visible = true;

					const type = child.userData.data.surfaceType;

					if ( type === 'InteriorFloor' || type === 'SlabOnGrade' || type === 'RaisedFloor' || type === 'UndergroundSlab' ) {

						REP.zoomIntoSurface( child.userData.data.id );

					}

				}

			}

		}

	};



	//////////

	REP.getGbjsonAttributes = function ( obj ) {

		let attributes = '';

		for ( let property in obj ) {

			if ( obj[ property ] !== null && typeof( obj[ property ] ) === 'object' ) {

				if ( property === 'AdjacentSpaceId' ) {

					//console.log( 'property', obj[ property ].length );

					if ( Array.isArray( obj[ property ] ) ) {

						attributes += REP.getAttributeAdjacentSpace( obj[ property ][ 0 ].spaceIdRef );
						attributes += REP.getAttributeAdjacentSpace( obj[ property ][ 1 ].spaceIdRef );

					} else {

						attributes += REP.getAttributeAdjacentSpace( obj[ property ].spaceIdRef );

					}

				}


			} else if ( property === 'CADObjectId' ) {

				attributes += REP.getAttributeCadObjectId( obj[ property ] );

			} else if ( property === 'id' ) {

				attributes += REP.getAttributeId( obj[ property ] );

			} else if ( property === 'surfaceType' ) {

				attributes += REP.getAttributeSurfaceType( obj[ property ] );

			} else if ( property === 'zoneIdRef' ) {

				attributes += REP.getAttributeZone( obj[ property ] );

			} else {

				attributes += '<div><span class=attributeTitle >' + property + ':</span> ' +
					'<span class=attributeValue >' + obj[ property ] + '</span></div>';

			}

		}

		return attributes;

	};



	REP.getAttributeAdjacentSpace = function( spaceIdRef ) {

		const txt = '<div><span class=attributeTitle >adjacent space id</span>: ' +
			'<button onclick=REP.setSpaceVisible(this.innerText); class="app-menu w3-theme-d1 w3-hover-theme w3-hover-border-theme" >' +
			spaceIdRef + '</button></div>';

		return txt;

	};



	REP.getAttributeCadObjectId = function( cadId ) {

		const txt = '<div><span class=attributeTitle >cad object id</span>: ' +
			'<button onclick=GBI.setCadObjectIdVisible(this.innerText); class="app-menu w3-theme-d1 w3-hover-theme w3-hover-border-theme" >' +
			cadId + '</button></div>';

		return txt;

	};



	REP.getAttributeSurfaceType = function( surfaceType ) {

		const txt = '<div><span class=attributeTitle >surface type:</span>: ' +
		'<button onclick=REP.setSurfaceTypeVisible(this.innerText); class="app-menu w3-theme-d1 w3-hover-theme w3-hover-border-theme" >' +
			surfaceType + '</button></div>';

		return txt;

	};



	REP.getAttributeZone = function( zoneId ) {

		const txt = '<div><span class=attributeTitle >zone id</span>: ' +
		'<button onclick=REP.setZoneVisible(this.innerText); class="app-menu w3-theme-d1 w3-hover-theme w3-hover-border-theme" >' +
			zoneId + '</button></div>';

		return txt;

	};


	//////////

	REP.xxxsetSelectedIndex = function( input ) {

		const str = input.value.toLowerCase();

		for ( let option of REPselItem.options ) {

			if ( option.innerHTML.toLowerCase().includes( str ) ) {

				REPselItem.value = option.value;

				return;

			}

		}

	};



	REP.getGoogleMap = function() {

		const locate = GBP.gbjson.Campus.Location;  // remember that location is a reserved word in your browser
		let linkToMap;

		if ( locate && locate.Latitude && locate.Longitude ) {

			const link = 'https://www.google.com/maps/@' + locate.Latitude + ',' + locate.Longitude + ',17z';

			linkToMap = ' &raquo; <a href="'+ link + '" style=background-color:lightblue; target=_blank > &#x1f310; </a>';

		} else {

			linkToMap = '';

		}

		return '<span title="Use context menu to open a Google Map in a new tab" >' + linkToMap + '<span>';

	};



	REP.initRep();
