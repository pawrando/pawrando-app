window.PawRandoBalades = {
  lireGPX: function(texte) {
    const xml = new DOMParser().parseFromString(texte, "application/xml");
    if (xml.querySelector("parsererror")) throw new Error("Fichier GPX invalide");
    const points = [...xml.getElementsByTagName("*")].filter(e => ["trkpt","rtept"].includes(e.localName));
    const coords = points.map(p => {
      const ele = [...p.children].find(e => e.localName === "ele");
      return {lat: Number(p.getAttribute("lat")), lon: Number(p.getAttribute("lon")), ele: ele ? Number(ele.textContent) : null};
    }).filter(p => Number.isFinite(p.lat) && Number.isFinite(p.lon) && Math.abs(p.lat)<=90 && Math.abs(p.lon)<=180);
    if (coords.length < 2) throw new Error("Parcours insuffisant");
    const rad = x => x * Math.PI / 180;
    let distance = 0, denivele = 0;
    for(let i=1;i<coords.length;i++){
      const a=coords[i-1], b=coords[i];
      const dlat=rad(b.lat-a.lat), dlon=rad(b.lon-a.lon);
      const h=Math.sin(dlat/2)**2+Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(dlon/2)**2;
      distance += 6371*2*Math.atan2(Math.sqrt(h),Math.sqrt(1-h));
      if(a.ele!==null && b.ele!==null) denivele+=Math.max(0,b.ele-a.ele);
    }
    return {coords, distanceKm:distance.toFixed(2), deniveleM:Math.round(denivele)};
  }
};
