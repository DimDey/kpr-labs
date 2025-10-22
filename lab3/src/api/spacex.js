class SpaceX {
    constructor(baseUrl = "https://api.spacexdata.com/v4/") {
        this.baseUrl = baseUrl;
    }

    launches() {
        return fetch(`${this.baseUrl}launches`).then(res => res.json());
    }

    launchpads() {
        return fetch(`${this.baseUrl}launchpads`).then(res => res.json());
    }

    launchpad(id) {
        return fetch(`${this.baseUrl}launchpads/${id}`).then(res => res.json());
    }

    async getData() {
        const [launches, launchpads] = await Promise.all([
            this.launches(),
            this.launchpads()
        ]);
        return { launches, launchpads };
    }
}

export { SpaceX };
