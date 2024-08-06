# pod-logfile-extension

> Simple extension to spawn a page display the pod logfile from a local Grafana server.

## IMPORTANT: You must change the URL globally to the page you want to display.

The default of `https://CHANGEME/grafana/mydashboard` is not functional.

Edit the plugin.json in the pod-logfile-extension schemas directory. The location of this file
depends on your jupyter installation: for example, in a root-installed conda deployment, it is
`/opt/conda/share/jupyter/labextensions/pod-logfile-extension/schemas/pod-logfile-extension/plugin.json`

