import { Map } from "./map.js";
import { Geographica } from "./geographica.js";

window.onload = function() {

    // let key = "AjlK-Vz68sl-QzR7u8glVv0pP-qbODTM9kpDVHxzXK8v9SMvhLfOQCrDqwyLCU7I";
    // let url = "http://dev.virtualearth.net/REST/V1/Imagery/Metadata/Road?output=json&include=ImageryProviders&key="
    // url = url + key;
    // let urlTemplate;
    // fetch(url)
    // .then(response => {
    //     return response.json();
    // })
    // .then(data => {
    //     let resource = data.resourceSets[0].resources[0];
    //     urlTemplate = resource.imageUrl;
    // });


    let map = new Map(800, 600, new Geographica(104.07, 30.67));

    map.levelOfDetail = 1;

    map.update();

}