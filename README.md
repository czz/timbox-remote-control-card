# TimBox Remote Control card for Home Assistant

<img src="https://czz78.com/images/Tim_remotes.png" height="400">

```
resources:
  - url: /hacsfiles/timbox-remote-control-card/timbox-remote-control-card.js
    type: module
```

configuration is very easy. first, find your TimBox or TimVision id for sending packets (can be found under HA services page),
and then just configure a unique remote id and the template for your remote.

All buttons are already configured;

##TimBox remote control example

```
name: TimBox
type: custom:timbox-remote-control-card
remote_id: 1
entity_id: media_player.android_tv_192_168_1_141

```

##TimVision remote example example

```
name: TimBox
type: custom:timbox-remote-control-card
remote_id: 2
entity_id: media_player.android_tv_192_168_1_141
remote_template: 2

```

some fixes where made on 20 feb 2022
