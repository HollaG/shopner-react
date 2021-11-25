const HelpText = () => {
    return (
        <div className="help-text text-xs text-center text-gray-800 mt-1">
            <b> ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ BASIC USAGE ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯</b>
            {/* <p> This extension will open sites of your choice with the search term pre-filled, to save you time in manually entering it for each site.</p> */}
            <p>
                To automatically open all sites which are enabled with your
                search text, click on
                <b>"Open all enabled"</b>.
            </p>
            <p>
                To control which sites are automatically opened, right click on
                the <b>respective site's icon</b> to disable it. To re-enable
                it, right click again.
            </p>
            <b> ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ GROUPS ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ </b>
            {/* <p>
    Saving a custom Group allows you to quickly access a custom
    configuration of sites. You may click on the Group to
    retrieve this configuration at any time.
</p> */}
            <p>
                To <b>create</b> a custom Group, set the enabled/disabled sites
                to your preference, then click on <b>"Create Group"</b>.
            </p>
            <p>
                To <b>delete</b> a custom Group, right click on it.
            </p>
            <p className="text-red-500">
                
                WARNING: Clicking the 'Create Group' button too quickly will
                cause errors! Additionally, you are limited to <b>
                    10 Groups
                </b>.
            </p>
            {/* <b> ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ ADVANCED USAGE ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ </b>
<p> By highlighting text and right-clicking, you can access many of this extension's functions from the pop-up menu. </p>
<p> Highlighted text will also automatically appear in the input box, so you do not have to re-enter it.</p> */}
        </div>
    );
};

export default HelpText;
