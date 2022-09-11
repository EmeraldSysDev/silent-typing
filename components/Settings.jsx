const { React } = require("powercord/webpack");
const { SwitchItem } = require("powercord/components/settings");

module.exports = class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            enabled: this.props.getSetting("enabled", false)
        };
    };

    render() {
        return <div>
            <SwitchItem
                value={this.state.enabled}
                onChange={() => this.props.toggleSetting("enabled")}
            >
                Enabled
            </SwitchItem>
        </div>
    };
};