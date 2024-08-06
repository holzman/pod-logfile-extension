import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ICommandPalette, MainAreaWidget } from '@jupyterlab/apputils';
import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { Widget } from '@lumino/widgets';
import { ILauncher } from '@jupyterlab/launcher';
import { requestAPI } from './handler';

const PLUGIN_ID = 'pod-logfile-extension:plugin';

/**
 * Initialization data for the extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: PLUGIN_ID,
  description: "A command to open the user's logfile in Landscape",
  autoStart: true,
  optional: [ILauncher],
  requires: [ICommandPalette, ISettingRegistry],
  activate: async (
    app: JupyterFrontEnd,
    palette: ICommandPalette,
    settingRegistry: ISettingRegistry
  ) => {
    console.log('JupyterLab extension pod-logfile is now activated');
    const newWidget = () => {
      const content = new Widget();
      const widget = new MainAreaWidget({ content });
      widget.id = 'logfile-jupyterlab';
      widget.title.label = 'Pod Logfile';
      widget.title.closable = true;

      const iframe = document.createElement('iframe');
      let url = '';
      requestAPI<any>('podname')
        .then(async data => {
          const settings = await settingRegistry.load(PLUGIN_ID);
          url = settings.get('url').composite as string;

          iframe.src = `${url}&var-podname=${data.data}`;
          console.log(`Setting iframe.src to ${url}&var-podname=${data.data}`);
        })
        .catch(reason => {
          console.error(
            `The pod_logfile_server server extension appears to be missing.\n${reason}`
          );
        });
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = 'none';

      content.node.appendChild(iframe);

      return widget;
    };

    let widget = newWidget();
    const command: string = 'logfile:open';

    app.commands.addCommand(command, {
      label: 'Show Pod Logfile',
      execute: () => {
        if (widget.isDisposed) {
          widget = newWidget();
        }
        if (!widget.isAttached) {
          app.shell.add(widget, 'main');
        }
        app.shell.activateById(widget.id);
      }
    });
    palette.addItem({ command, category: 'Stuff' });
  }
};

export default plugin;
