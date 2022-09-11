const { Plugin } = require("powercord/entities");
const { typing } = require("powercord/webpack");

const Settings = require("./components/Settings");

module.exports = class SilentTyping extends Plugin {
    startPlugin() {
        powercord.api.settings.registerSettings(this.entityID, {
            category: this.entityID,
            label: "Silent Typing",
            render: Settings
        });
        powercord.api.commands.registerCommand({
            command: "togglesilent",
            description: "Toggles silent typing",
            usage: "{c}",
            executor: this.toggle.bind(this)
        });

        this.hookTyping = typing.startTyping;
        if (this.settings.get("enabled", false)) {
            typing.startTyping = () => {};
        }
    }

    toggle() {
        const old = this.settings.get("enabled", false);
        const enabled = !old;
        this.settings.set("enabled", enabled);
        if (enabled) {
            typing.startTyping = () => {};
        } else {
            typing.startTyping = this.hookTyping;
        }
        powercord.api.notices.closeToast("silentNotif");
        powercord.api.notices.sendToast("silentNotif", {
            header: "Silent Typing",
            content: `${(enabled == true) ? "You are now silent." : "You're no longer silent!"}`,
            buttons: [{
                text: "Dismiss",
                color: "red",
                look: "outlined",
                onClick: () => powercord.api.notices.closeToast("silentNotif")
            }]
        });
    }

    pluginWillUnload() {
        typing.startTyping = this.hookTyping;
        powercord.api.commands.unregisterCommand("togglesilent");
        powercord.api.settings.unregisterSettings(this.entityID);
    }
};