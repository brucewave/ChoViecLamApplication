export async function getDirection(from, to) {
    const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/walking/${from[0]},${from[1]};${to[0]},${to[1]}?alternatives=false&annotations=distance%2Cduration&continue_straight=true&geometries=geojson&overview=full&steps=false&access_token=${process.env.MAP_BOX_API}`
    );
    const json = await response.json();
    console.log(json);
    return json;
}