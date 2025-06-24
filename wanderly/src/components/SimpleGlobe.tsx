import React, { useEffect, useRef } from "react";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

type SimpleGlobeProps = {
  coords?: { lat: number; lng: number } | null;
  destination?: string;
};

const SimpleGlobe: React.FC<SimpleGlobeProps> = ({ coords, destination }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !GOOGLE_MAPS_API_KEY) return;

    // If already loaded, don't load again
    if ((window as any).google?.maps?.importLibrary) {
      initMap();
      return;
    }

    // Dynamically load the Google Maps JS API
    const script = document.createElement("script");
    const params = new URLSearchParams({
      key: GOOGLE_MAPS_API_KEY,
      v: "alpha",
      callback: "initMap3D",
    });
    script.src = `https://maps.googleapis.com/maps/api/js?${params}`;
    script.async = true;
    script.defer = true;

    (window as any).initMap3D = initMap;

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
      delete (window as any).initMap3D;
    };
    // eslint-disable-next-line
  }, [coords, destination]);

  async function initMap() {
    if (!(window as any).google?.maps?.importLibrary) return;

    const { Map3DElement, MapMode, Marker3DInteractiveElement } = await (window as any).google.maps.importLibrary("maps3d");
    const { PinElement } = await (window as any).google.maps.importLibrary('marker');

    if (mapContainerRef.current) {
      mapContainerRef.current.innerHTML = "";

      // Europe camera view
      const europeCamera = {
        center: { lat: 46.717, lng: 7.075, altitude: 2175.130 },
        range: 5814650,
        tilt: 33,
        heading: 4.36,
      };

      // Base URL for flags
      const base = window.location.origin;

      // Office locations array
      const officeLocations = [
        {
          name: "Google France",
          details: "8 Rue de Londres, 75009 Paris, France",
          camera: {
            center: { lat: 48.877276, lng: 2.329978, altitude: 48 },
            range: 178,
            tilt: 57.48,
            heading: -17,
          },
          point: { lat: 48.8775183, lng: 2.3299791, altitude: 60 },
          pin: {
            background: 'white',
            glyph: new URL('/flags/fr.svg', base),
            scale: 1.0,
          },
        },
        {
          name: "Google UK",
          details: "6 Pancras Square, London N1C 4AG, UK",
          camera: {
            center: { lat: 51.5332, lng: -0.1260, altitude: 38.8 },
            range: 500,
            tilt: 56.21672368296945,
            heading: -31.15763027564165,
          },
          point: { lat: 51.5332, lng: -0.1260, altitude: 75 },
          pin: {
            background: 'white',
            glyph: new URL('/flags/gb.svg', base),
            scale: 1.0,
          },
        },
        {
          name: "Google Belgium",
          details: "Chau. d'Etterbeek 180, 1040 Brussel",
          camera: {
            center: { lat: 50.83930408436509, lng: 4.38052394507952, altitude: 64.38932203802196},
            range: 466.62899893119175,
            tilt: 43.61569474716178,
            heading: 51.805907046332074,
          },
          point: { lat: 50.8392653, lng: 4.3808751, altitude: 25 },
          pin: {
            background: 'white',
            glyph: new URL('/flags/be.svg', base),
            scale: 1.0,
          },
        },
        {
          name: "Google Czechia",
          details: "Stroupežnického 3191/17, 150 00 Praha 5-Smíchov",
          camera: {
            center: {
              lat: 50.07004093853976,
              lng: 14.402871475443956,
              altitude: 223.39574818495532
            },
            range: 522.0365799222782,
            tilt: 62.39511972890614,
            heading: -39.150149539328304,
          },
          point: { lat: 50.0703122, lng: 14.402668199999999, altitude: 50 },
          pin: {
            background: 'white',
            glyph: new URL('/flags/cz.svg', base),
            scale: 1.0,
          },
        },
        {
          name: "Google Denmark",
          details: "2, Sankt Petri Passage 5, 1165 København",
          camera: {
            center: {
              lat: 55.680359539635866,
              lng: 12.570460204526002,
              altitude: 30.447654757346044
            },
            range: 334.8786935049066,
            tilt: 55.38819319004654,
            heading: 149.63867461295067,
          },
          point: { lat: 55.6804504, lng: 12.570279099999999, altitude: 25 },
          pin: {
            background: 'white',
            glyph: new URL('/flags/dk.svg', base),
            scale: 1.0,
          },
        },
        {
          name: "Google Greece",
          details: "Fragkokklisias 6, Athina 151 25",
          camera: {
            center: {
              lat: 38.038634694028055,
              lng: 23.802924946201266,
              altitude: 196.45884670344995
            },
            range: 343.57226336076565,
            tilt: 54.97375927639567,
            heading: -33.26775344055724,
          },
          point: { lat: 38.038619, lng: 23.8031622, altitude: 25 },
          pin: {
            background: 'white',
            glyph: new URL('/flags/gr.svg', base),
            scale: 1.0,
          },
        },
        {
          name: "Google Germany",
          details: "ABC-Straße 19, 20354 Hamburg",
          camera: {
            center: {
              lat: 53.55397683312404,
              lng: 9.986350507286808,
              altitude: 44.83610870143956
            },
            range: 375.3474077822466,
            tilt: 71.35078443829818,
            heading: -160.76930098951416,
          },
          point: { lat: 53.5540227, lng: 9.9863, altitude: 50 },
          pin: {
            background: 'white',
            glyph: new URL('/flags/de.svg', base),
            scale: 1.0,
          },
        },
        {
          name: "Google Ireland",
          details: "Gordon House, 4 Barrow St, Grand Canal Dock, Dublin 4, D04 V4X7",
          camera: {
            center: { lat: 53.339816899999995, lng: -6.2362644, altitude: 38.777415761228006 },
            range: 500,
            tilt: 56.21672368296945,
            heading: -31.15763027564165,
          },
          point: { lat: 53.339816899999995, lng: -6.2362644, altitude: 50 },
          pin: {
            background: 'white',
            glyph: new URL('/flags/ie.svg', base),
            scale: 1.0,
          },
        },
        {
          name: "Google Italy",
          details: "Isola Building C, Via Federico Confalonieri, 4, 20124 Milano",
          camera: {
            center: {
              lat: 45.486361346538224,
              lng: 9.18995496294455,
              altitude: 138.55834058400072
            },
            range: 694.9398023590038,
            tilt: 57.822470255679114,
            heading: 84.10194883488619,
          },
          point: { lat: 45.4863064, lng: 9.1894762, altitude: 50 },
          pin: {
            background: 'white',
            glyph: new URL('/flags/it.svg', base),
            scale: 1.0,
          },
        },
        {
          name: "Google Lithuania",
          details: "Vilnius Tech Park, Antakalnis st. 17, 2nd building, LT-10312, Vilnius",
          camera: {
            center: {
              lat: 54.698040606567965,
              lng: 25.30965338542576,
              altitude: 111.80276944294413
            },
            range: 412.5808304977545,
            tilt: 43.50793332082195,
            heading: -29.181098269421028,
          },
          point: { lat: 54.6981204, lng: 25.3098617, altitude: 25 },
          pin: {
            background: 'white',
            glyph: new URL('/flags/lt.svg', base),
            scale: 1.0,
          },
        },
        {
          name: "Google Netherlands",
          details: "Claude Debussylaan 34, 1082 MD Amsterdam",
          camera: {
            center: {
              lat: 52.33773837150874,
              lng: 4.871754560171063,
              altitude: 53.68063996154723
            },
            range: 473.1982259177312,
            tilt: 56.216523350388634,
            heading: 71.78252318033718,
          },
          point: { lat: 52.337801, lng: 4.872065999999999, altitude: 100 },
          pin: {
            background: 'white',
            glyph: new URL('/flags/nl.svg', base),
            scale: 1.0,
          },
        },
        {
          name: "Google Norway",
          details: "Bryggegata 6, 0250 Oslo",
          camera: {
            center: { lat: 59.90991209999999, lng: 10.726020799999999, altitude: 38.777415761228006 },
            range: 500,
            tilt: 56.21672368296945,
            heading: -31.15763027564165,
          },
          point: { lat: 59.90991209999999, lng: 10.726020799999999, altitude: 25 },
          pin: {
            background: 'white',
            glyph: new URL('/flags/no.svg', base),
            scale: 1.0,
          },
        },
        {
          name: "Google Poland",
          details: "Rondo Daszynskiego 2, 00-843 Warsaw",
          camera: {
            center: { lat: 52.22844380000001, lng: 20.9851819, altitude: 38.777415761228006 },
            range: 500,
            tilt: 56.21672368296945,
            heading: -31.15763027564165,
          },
          point: { lat: 52.22844380000001, lng: 20.9851819, altitude: 25 },
          pin: {
            background: 'white',
            glyph: new URL('/flags/pl.svg', base),
            scale: 1.0,
          },
        },
        {
          name: "Google Portugal",
          details: "R. Duque de Palmela 37 Piso 4, 1250-097 Lisboa",
          camera: {
            center: {
              lat: 38.7240122810727,
              lng: -9.150628263172639,
              altitude: 55.299662291551044
            },
            range: 337.7474313328639,
            tilt: 56.79772652682846,
            heading: 176.0722118222208,
          },
          point: { lat: 38.723915999999996, lng: -9.150629, altitude: 35 },
          pin: {
            background: 'white',
            glyph: new URL('/flags/pt.svg', base),
            scale: 1.0,
          },
        },
        {
          name: "Google Romania",
          details: "Bulevardul Corneliu Coposu 6-8, București 030167",
          camera: {
            center: {
              lat: 44.43076650172983,
              lng: 26.109700164718586,
              altitude: 125.57895810814505
            },
            range: 364.25249956711923,
            tilt: 38.517539223834326,
            heading: -38.81294924429363,
          },
          point: { lat: 44.4309897, lng: 26.1095719, altitude: 75 },
          pin: {
            background: 'white',
            glyph: new URL('/flags/ro.svg', base),
            scale: 1.0,
          },
        },
        {
          name: "Google Spain",
          details: "Torre Picasso, Pl. Pablo Ruiz Picasso, 1, Tetuán, 28020 Madrid",
          camera: {
            center: {
              lat: 40.450078762608875,
              lng: -3.6930085080020856,
              altitude: 753.6446342341894
            },
            range: 845.7279793010093,
            tilt: 46.752510050599746,
            heading: 4.718779524265234,
          },
          point: { lat: 40.450294199999995, lng: -3.6927915, altitude: 175 },
          pin: {
            background: 'white',
            glyph: new URL('/flags/es.svg', base),
            scale: 1.0,
          },
        },
        {
          name: "Google Sweden",
          details: "Kungsbron 2, 111 22 Stockholm",
          camera: {
            center: {
              lat: 59.33313751316038,
              lng: 18.054618219238293,
              altitude: 16.728213706832868
            },
            range: 377.5210725830039,
            tilt: 63.59478230626709,
            heading: 98.53138488367703,
          },
          point: { lat: 59.3332093, lng: 18.0536386, altitude: 50 },
          pin: {
            background: 'white',
            glyph: new URL('/flags/se.svg', base),
            scale: 1.0,
          },
        },
        {
          name: "Google Switzerland",
          details: "Brandschenkestrasse 110, 8002 Zürich",
          camera: {
            center: {
              lat: 47.365411056285275,
              lng: 8.525063594405356,
              altitude: 419.2348376754488
            },
            range: 166.74918737631742,
            tilt: 59.31431457129067,
            heading: -32.620415961949206,
          },
          point: { lat: 47.365452, lng: 8.5249253, altitude: 100 },
          pin: {
            background: 'white',
            glyph: new URL('/flags/ch.svg', base),
            scale: 1.0,
          },
        },
      ];

      const map3D = new Map3DElement({
        ...europeCamera,
        mode: MapMode.SATELLITE,
      });

      officeLocations.forEach((office) => {
        const marker = new Marker3DInteractiveElement({
          position: office.point,
          label: office.name,
          altitudeMode: 'ABSOLUTE',
          extruded: true,
        });

        marker.addEventListener('gmp-click', (event: any) => {
          map3D.flyCameraTo({
            endCamera: office.camera,
            durationMillis: 5000,
          });

          map3D.addEventListener('gmp-animationend', () => {
            map3D.flyCameraAround({
              camera: office.camera,
              durationMillis: 5000,
              rounds: 1,
            });

            map3D.addEventListener('gmp-animationend', () => {
              map3D.flyCameraTo({
                endCamera: europeCamera,
                durationMillis: 5000,
              });
            }, { once: true });

          }, { once: true });

          event.stopPropagation();
        });

        const markerPin = new PinElement(office.pin);
        marker.append(markerPin);
        map3D.append(marker);
      });

      mapContainerRef.current.appendChild(map3D);
    }
  }

  return (
    <div
      ref={mapContainerRef}
      style={{
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
        overflow: "hidden",
      }}
    />
  );
};

export default SimpleGlobe;