const HelpText = () => {
    return (
        <div className="help-text text-xs text-center text-gray-800 mt-1">
            <b> ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ BASIC USAGE ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯</b>
            {/* <p> This extension will open sites of your choice with the search term pre-filled, to save you time in manually entering it for each site.</p> */}
            <p>
                To open all sites with your search text, click on{" "}
                <b>"Open all enabled"</b>.
            </p>
            <p>
                To prevent some sites from opening, right click on the{" "}
                <b>respective site's icon</b> to disable it. To re-enable it,
                right click again.
            </p>
            <b> ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ GROUPS ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ </b>
            {/* <p>
    Saving a custom Group allows you to quickly access a custom
    configuration of sites. You may click on the Group to
    retrieve this configuration at any time.
</p> */}
            <p>
                To <b>create</b> a Group, ensure that only the sites that you’d
                like to automatically open are enabled. Enter a group name, then
                click <b>"Create Group"</b>.
            </p>
            <p>
                To <b>delete</b> a Group, right click on the group name.
            </p>
            <p className="text-red-500">
                WARNING: Clicking the 'Create Group' button too quickly will
                cause errors! Additionally, you are limited to <b>10 Groups</b>.
            </p>
            <p>
                For more information, please visit{" "}
                <a
                    href="https://chrome.google.com/webstore/detail/simpleshopping/plnplpfflofeemhiakppmjmmkbicdecb?hl=en&authuser=0"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    the store page
                </a>
                .
            </p>
            {/* <b> ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ ADVANCED USAGE ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ </b>
<p> By highlighting text and right-clicking, you can access many of this extension's functions from the pop-up menu. </p>
<p> Highlighted text will also automatically appear in the input box, so you do not have to re-enter it.</p> */}
        </div>
    );
};

export default HelpText;
