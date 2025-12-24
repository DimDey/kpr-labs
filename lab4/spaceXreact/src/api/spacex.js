class SpaceX{

    constructor(baseUrl = "https://api.spacexdata.com/v4/") {
        this.baseUrl = baseUrl;
    }

    launches(){
        return fetch(`${this.baseUrl}launches`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            });
    }

    launchpads(){
        return fetch(`${this.baseUrl}launchpads`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            });
    }

    launchpad(id){
        return fetch(`${this.baseUrl}launchpads/${id}`)
            .then(response=>response.json());
    }

    starlinks(){
        return fetch(`${this.baseUrl}starlink`)
            .then(response=>response.json());
    }
}

export {SpaceX}


