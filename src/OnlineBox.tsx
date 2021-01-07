
function OnlineBox(props: {active: Array<string>, inactive: Array<string>}) {

    return (
        <div className="padding responsive small light warm second split shadow top right aside-width margin hide mobile">
        <h6 className="no-margin-top text-margin-bottom big text-trim">Who's here?</h6>
        <ul className="no-list-style no-margin-bottom warm second split inset padding">

            {props.active.map((name: string) => (
                <li className="no-margin-bottom">
                    <span className="small badge em-width text-trim no-text inline-block green">
                        active
                    </span> {name}
                </li>
            ))}
            
            {props.inactive.map((name: string) => (
                <li className="no-margin-bottom fade">
                    <span className="small badge em-width text-trim no-text inline-block blue dim">
                        inactive
                    </span> {name}
                </li>
            ))}

        </ul>
    </div>
    );

}

export default OnlineBox;