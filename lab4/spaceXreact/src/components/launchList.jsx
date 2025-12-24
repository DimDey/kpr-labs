function LaunchList({ launches, onLaunchHover, onLaunchLeave }) {
    const handleMouseEnter = (launchpadId) => {
        if (launchpadId && onLaunchHover) {
            onLaunchHover(launchpadId);
        }
    };

    const handleMouseLeave = () => {
        if (onLaunchLeave) {
            onLaunchLeave();
        }
    };

    return (
        <aside className="aside" id="launchesContainer">
            <h3>Launches</h3>
            <div id="listContainer">
                {launches.length === 0 ? (
                    <p>Загрузка запусков...</p>
                ) : (
                    <ul>
                        {launches.map(launch => {
                            return (
                                <li 
                                    key={launch.id}
                                    onMouseEnter={() => handleMouseEnter(launch.launchpad)}
                                    onMouseLeave={handleMouseLeave}
                                    style={{ cursor: launch.launchpad ? 'pointer' : 'default' }}
                                >
                                    {launch.name}
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </aside>
    )
}

export { LaunchList }
