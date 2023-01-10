
class TimboxRemotControlCard extends HTMLElement {

  constructor() {

    super();
    this.attachShadow({ mode: 'open' });
    this.buttons = {}

  }


  setConfig(config) {

    if (!config.remote_id || isNaN(config.remote_id)) {
      throw new Error('You need to define a unique remote_id in decimal');
    }

    if (config.remote_template && isNaN(config.remote_template)) {
      throw new Error('You need to define a decimal value for remote_template');
    }

    if (!config.entity_id) {
      throw new Error('You need to define an entity_id');
    }

    const root = this.shadowRoot;
    if (root.lastChild) root.removeChild(root.lastChild);
    const cardConfig = Object.assign({}, config);
    this._config = cardConfig;

  }

  set hass(hass) {

    const config = this._config;
    const base_url = `/hacsfiles/timbox-remote-control-card`;

    var name = '';
    if(config.name) {
      name= config.name.replace(/[^a-zA-Z0-9,:;\-.?! ]/g, '');
    }

    var remote_template = 1;
    if (config.remote_template) {
        remote_template = parseInt(config.remote_template);
    }

    const request = new XMLHttpRequest();
    request.open('GET', `/hacsfiles/timbox-remote-control-card/templates/${remote_template}/conf.json`, false);
    request.send();
    this.buttons = JSON.parse(request.responseText);

    config.remote_id = parseInt(config.remote_id);


    var html = `<div style="text-align:center">
                  <h1>${name}</h1>
                </div>
                <div id="remote-control-timbox-${config.remote_id}">
                  <ul>
               `;

    var css = `
                 #remote-control-timbox-${config.remote_id} {
                   position: relative;
                   height: 650px;
                   width:168px;
                   background: url(${base_url}/templates/${remote_template}/remote.png) no-repeat;
                   background-position: center;
                   margin: 0 auto;
                 }

                 #remote-control-timbox-${config.remote_id} ul {
                   margin: 0;
                   padding: 0;
                   list-style-type: none;
                 }

                 #remote-control-timbox-${config.remote_id} .timbox-button a {
                   position: relative;
                   display: block;
                   color: transparent;
                   font-size: 0px;
                 }

                 #remote-control-timbox-${config.remote_id} .timbox-button.small-circle a {
                   width: 35px;
                   height: 35px;
                 }

                 #remote-control-timbox-${config.remote_id} .timbox-button.big-circle a {
                   width: 37px;
                   height: 37px;
                 }

                 #remote-control-timbox-${config.remote_id} .timbox-button.small-ellipse a {
                   width: 37px;
                   height: 25px;
                 }

                 #remote-control-timbox-${config.remote_id} .timbox-button.big-ellipse a {
                   width: 53px;
                   height: 35px;
                 }

                 #remote-control-timbox-${config.remote_id} li a:hover {
                   border: 1px solid gray;
                   border-radius: 20px;
                 }
                `;


    for (const [key, value] of Object.entries(this.buttons)) {

      console.log(key, value);

      html += `<li class="timbox-button timbox-button-${key} ${value.cl}"><a href="#" title="${value.title}"><span>${value.title}</span></a></li>`;
      css += `
              #remote-control-timbox-${config.remote_id} li.timbox-button-${key} a {
                left: ${value.left};
                top: ${value.top};
              }
             `;


    }

    html += `</ul></div>`;

    const root = this.shadowRoot;
    this._hass = hass;
    // root.lastChild.hass = hass;
    const card = document.createElement('ha-card');

    if(!this.content) {

      this.content = document.createElement('div');
      const style = document.createElement('style');
      style.textContent = css;
      this.content.innerHTML = html;
      card.appendChild(this.content);
      card.appendChild(style);
      root.appendChild(card);
      this._bindButtons(card, this._hass, this._config);

    }

  }


  _bindButtons(card, hass, config) {

    for (const [key, value] of Object.entries(this.buttons)) {
      let className= `timbox-button-${key}`;
      let button = card.getElementsByClassName(className)[0];
      button.addEventListener('click', function(source) {
        hass.callService("androidtv", "adb_command", {entity_id: config.entity_id, command: value.cmd });
      });

    }

  }


  getCardSize() {

    return 3;

  }

}

customElements.define('timbox-remote-control-card', TimboxRemotControlCard);
