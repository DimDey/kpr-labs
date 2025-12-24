import { LaunchList } from "./launchList";
import { Map } from "./map";
import { useEffect, useState, useMemo } from "react";
import { SpaceX } from "../api/spacex";

function App() {
    const [launches, setLaunches] = useState([]);
    const [launchpads, setLaunchpads] = useState([]);
    const [highlightedLaunchpadId, setHighlightedLaunchpadId] = useState(null);
    const spacex = useMemo(() => new SpaceX(), []);

    useEffect(() => {
        // Получаем launches и launchpads параллельно
        Promise.all([
            spacex.launches(),
            spacex.launchpads()
        ]).then(([launchesData, launchpadsData]) => {
            console.log("Launches data:", launchesData);
            console.log("Launchpads data:", launchpadsData);
            setLaunches(launchesData);
            setLaunchpads(launchpadsData);
        }).catch((error) => {
            console.error("Error fetching data:", error);
        });
    }, [spacex]);

    const handleLaunchHover = (launchpadId) => {
        setHighlightedLaunchpadId(launchpadId);
    };

    const handleLaunchLeave = () => {
        setHighlightedLaunchpadId(null);
    };

    return (
        <main className='main'>
            <LaunchList 
                launches={launches} 
                onLaunchHover={handleLaunchHover}
                onLaunchLeave={handleLaunchLeave}
            />
            <Map 
                launchpads={launchpads}
                highlightedLaunchpadId={highlightedLaunchpadId}
            />
        </main>
    )
}

export { App };
