title: Create simulation inputs with Simput
---

<style>
center.half > img {
  width: 50%;
}
</style>

This example is more complete and complex than the simple [vcard example](vcard.html). It includes three output files and the different views to support them. We will walk you through the model definition and its usage inside Simput.

## What's an Oscillator?

We are going to create input files for the [oscillators miniapp](https://gitlab.kitware.com/sensei/sensei/tree/master/miniapps/oscillators), which is part of the [Sensei project](https://gitlab.kitware.com/sensei/sensei). It is designed to emulate the output of a simulation, without actually doing the complicated calculations typical of a simulation. It is used to test the performance of in-situ analysis code, which takes the raw output of a simulation and either visualizes it or performs analysis on it to summarize or compress the results.

The oscillator app takes as input a list of gaussian oscillators with a few parameters that tell their position, size, and how they vary over time. The contents of an input file might look like this:

```
# type      center      r       omega0      zeta
damped      32 32 32    12.5    3.14        0.3
damped      48 32 48    5       3.14        0.1
decaying    16 32 48    15      3.14
periodic    16 32 16    10      9.5
periodic    48 32 16    15      3.14
```

We will also create two other input files. The first is an xml specification of a list of analyses to perform on the simulation output. The second is a script file to run the oscillator in a multi-process context with the other two input files. We'll get back to those other files later on.

## Creation of the new type

### Setup

First we need to create a directory for our files. After [cloning simput](develop_requirement.html) and running `npm install`, create the directories `types/oscillator/src`, and the file `types/oscillator/README.md` to document our type.

Next we add a line to `package.json` to compile our type:
```js
  "scripts": {
    // ...
    "type:oscillator": "node ./src/cli/simput-cli.js -c ./types/oscillator/src -o ./static/types -t oscillator",
  }
```

Finally we add our type to the landing page. In `static/index.html`:
```js
      // Register various template
      Simput.registerType('demo', ['./types/demo.js']);
      // add to list:
      Simput.registerType('oscillator', ['./types/oscillator.js']);
```

and in `src/samples/index.js`:
```js
  {
    label: 'Oscillator',
    image: Images.oscillator,
    // icon: 'wb_sunny', // or start with an icon
    description: 'Oscillator source for In-Situ simulation',
    acknowledgement: 'Example by Kitware Inc.',
    model: {
      type: 'oscillator',
      data: {},
    },
  },
```
We added an image in the `images` subdirectory, but an icon from `vuetify` can be used instead.

### Model creation

Let's create a View to contain our list of gaussian oscillators. The is specified as a json or javascript object, though we recommend javascript because it can contain comments. Our __data model__ needs an entry for each of the gaussian's parameters, and the variable-sized list to contain them. Create the file `types/oscillator/src/model.js`:

```js
// model.js
module.exports = {
  order: ['oscillators'],
  views: {
    oscillators: {
      size: -1,
      attributes: ['oscillator'],
      hooks: [
        {
          type: 'copyParameterToViewName',
          attribute: 'oscillator.name',
        },
      ],
    },
  },
  definitions: {
    oscillator: {
      parameters: [
        {
          id: 'name',
          label: 'Name',
          type: 'string',
          size: 1,
        },
        {
          id: 'type',
          type: 'enum',
          size: 1,
          default: 'periodic',
          domain: {
            Periodic: 'periodic',
            Decaying: 'decaying',
            Damped: 'damped',
          },
        },
        {
          id: 'center',
          type: 'int',
          size: 3,
          layout: '3',
          default: [0, 0, 0],
        },
        {
          id: 'radius',
          type: 'double',
          size: 1,
          default: [1],
        },
        {
          id: 'omega0',
          type: 'double',
          size: 1,
          default: [1],
        },
        {
          id: 'zeta',
          type: 'double',
          size: 1,
          show: "type[0] === 'damped'",
        },
      ],
    },
  },
};
```

This model definition will be automatically displayed as a form for the user to fill out, with add and delete buttons for changing the list of oscillators.

These parameters illustrate some of the different types and options available. Parameter types can be `double`, `int`, `string`, `enum`, or `bool`. Parameters like `center` with a `size` greater than 1 can choose different layouts. The `zeta` parameter doesn't have a default value, so it is only defined if the user fills it in. It also is only visible depending on the value of the `type` parameter.

### Template file

Template files define our output - the files we produce for input to the simulation. The oscillator list is very simple, with a single line per oscillator. Here, we just loop over lines and output them, using triple-curly-brace to signal a variable substitution. Several kinds of looping and conditionals are available inside a [Handlebars template](https://handlebarsjs.com/), which we'll see later.

```handlebars
{{!-- oscillator_list.hbs --}}
{{#each lines}}
{{line}}
{{/each}}
```

### Convert function

How do we get from our model and the input from the user, to the list of lines needed by our template? This is the job of the convert function. Let's take a look:

```js
// convert.js
const outputTemplate = require('./oscillator_list.hbs');

const COLUMN_SPACING = 5;

module.exports = function convert(dataModel) {
  const results = {};
  // Start with a standard header
  const lines = [['# type  ', 'center  ', 'r  ', 'omega0  ', 'zeta']];

  dataModel.data.oscillators.forEach((attributes) => {
    const oscillator = {};
    Object.keys(attributes.oscillator).forEach((fieldName) => {
      const value = attributes.oscillator[fieldName].value;
      if (value.length === 1) {
        oscillator[fieldName] = value[0];
      } else {
        oscillator[fieldName] = value;
      }
    });
    console.log(oscillator);
    lines.push([
      `${oscillator.type}`,
      `${oscillator.center[0]} ${oscillator.center[1]} ${oscillator.center[2]}`,
      `${oscillator.radius}`,
      `${oscillator.omega0}`,
      `${oscillator.zeta || ''}`,
    ]);
  });

  // Compute max size of each column
  const sizes = [0, 0, 0, 0, 0];
  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];
    for (let tokenIdx = 0; tokenIdx < line.length; tokenIdx++) {
      sizes[tokenIdx] = Math.max(sizes[tokenIdx], line[tokenIdx].length);
    }
  }

  // Add padding to align columns
  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];
    for (let tokenIdx = 0; tokenIdx < line.length; tokenIdx++) {
      while (line[tokenIdx].length < sizes[tokenIdx] + COLUMN_SPACING) {
        line[tokenIdx] += ' ';
      }
    }
    // collapse tokens
    lines[lineIdx] = { line: lines[lineIdx].join('') };
  }

  // Use dummy line writer
  results['oscillator_list.osc'] = outputTemplate({ lines });

  return { results, model: dataModel };
};
```

The conversion actually happens in the first loop, where the objects from the data model have their `value` fields extracted and put into a list in the correct order. Two more loops calculate lengths and add padding to make columns line up nicely. Finally, this statement: `lines[lineIdx] = { line: lines[lineIdx].join('') };` converts to a list of objects with the key `line`, which is used in the template as `{{line}}`.

Note that the `name` parameter is not actually used in the template and output. It is provided as a convenience to the user, so they can distinguish the different oscillators if they choose to.

## Compilation of new type

If you clone the repository and ran `npm install` during setup, you should be able to run:

```
$ npm run type:oscillator
```

to compile the new type, and in a separate window

```
$ npm run dev
```

to compile Simput and start a development server.

## Fill in your data

Open http://localhost:9999 in your browser.

<center class="half">
![](oscillator-step-0.png)
Landing page
</center>

Click the `oscillator` card.

<center class="half">
![](oscillator-step-1.png)
Initial empty page / content
</center>

Click the `+` button to add some oscillators, and start filling them in...

<center class="half">
![](oscillator-step-2.png)
Add some oscillators
</center>

Then press the `Save` button.

A zip file is written, which contains `oscillator_list.osc` along with the data model.

If you restart Simput and drag-and-drop this zip file onto the `Open an existing model` box, you will find all the information you've entered.

## Note about labels

We didn't include any `label` tags in our model definition, yet our screenshots show understandable labels and even help text. These are defined in the `lang/en` subdirectory, and can be translated into additional languages as needed. There is a straightforward mapping between the model definition and the `label.json` structure and help files that provide the UI text. [Take a look](https://github.com/Kitware/simput/tree/master/types/oscillator/src/lang/en).

## More output files

The oscillator requires two other files to run - an `xml` file that specifies which analyses to run, and a script that constructs the right command line to run in a multi-process environment using OpenMPI. Let's take a look at `ananlysis_config.xml` and `run_script.sh`

### Another template and model definition
Here's the template for `analysis_config.xml`:

```handlebars
{{!-- analysis_config.hbs --}}
<sensei>
{{#each histogram}}
  <analysis type="histogram" mesh="{{mesh}}" array="{{array}}" association="{{association}}"
    bins="{{bins}}" enabled="1" />
{{/each}}

{{#each autocorrelation}}
  <analysis type="autocorrelation" mesh="{{mesh}}" array="data" association="cell"
    window="{{window}}" k-max="{{kmax}}" enabled="1" />
{{/each}}

</sensei>
```

There are two types of analysis, histogram and autocorrelation. They have similar, but not identical parameters. The use of the `{% raw %}{{#each histogram}}{% endraw %}` construct lets us pass a list to the template, and output zero or more blocks, depending on how many objects are in the list. The `run_script.sh` template is very simple, [take a look here](https://github.com/Kitware/simput/blob/master/types/oscillator/src/run_script.hbs).

We need to add views to our data model for each of these files, like this:

```js
module.exports = {
  order: ['oscillators', 'analyses', 'run'],
  views: {
    oscillators: { ... }
    analyses: {
      size: -1,
      attributes: ['analysis'],
      hooks: [
        {
          type: 'copyParameterToViewName',
          attribute: 'analysis.name',
        },
      ],
    },
    run: {
      attributes: ['runParams'],
    },
  },
  definitions: {
    oscillator: { ... },
    analysis: {
      parameters: [
        {
          id: 'name',
          label: 'Name',
          type: 'string',
          size: 1,
        },
        {
          id: 'type',
          type: 'enum',
          size: 1,
          default: 'histogram',
          domain: {
            Histogram: 'histogram',
            Autocorrelation: 'autocorrelation',
          },
        },
        ["histogram", "autocorrelation"],
      ],
      children: {
        histogram: "analysis.type[0] === 'histogram'",
        autocorrelation: "analysis.type[0] === 'autocorrelation'",
      },
    },
    histogram: {
       parameters: [
          {
              id: 'mesh',
              type: 'enum',
              size: 1,
              default: 'mesh',
              domain: {
                Mesh: 'mesh',
                'Unstructured mesh': 'ucdmesh',
                'Particle velocity magnitude': 'particles',
              },
          },
          {
            id: 'bins',
            type: 'int',
            size: 1,
            default: [10],
          },
       ],
    },
    autocorrelation: {
       parameters: [
          {
              id: 'mesh',
              type: 'enum',
              size: 1,
              default: 'mesh',
              domain: {
                // currently only works on one type.
                Mesh: 'mesh',
              },
          },
          {
            id: 'window',
            type: 'double',
            size: 1,
            default: [10],
          },
          {
            id: 'kmax',
            type: 'double',
            size: 1,
            default: [3],
          },
       ],
    },
    runParams: {
      parameters: [
        {
          id: 'nodes',
          type: 'int',
          size: 1,
          default: [1],
        },
        {
          id: 'gridsize',
          type: 'int',
          size: 1,
          default: [64],
        },
        {
          id: 'dt',
          type: 'double',
          size: 1,
          default: [0.1],
        },
        {
          id: 'endT',
          type: 'double',
          size: 1,
          default: [10],
        },
      ],
    },
  },
};
```

The `oscillator` sections remain the same, but we add the new views to the `order` list. Note that the `analyses` view has a variable size, just like the list of oscillators, but the `run` section has only a single entry, since there is only one run script.

The `analysis` definition shows how to change your interface depnding on a parameter - when the user chooses between `Histogram` and `Autocorrelation`, one of the `children` is made visible based on the value of the `analysis.type` enum. You can also use `children` to simply organize blocks of parameters, and re-use them as part of different `definition` blocks. In the UI, they have their own header.

### Expanding the convert method

Earlier we saw the convert function looped over the list of oscillators created by the user, and formatted them into lines that are output via the template. Our two new output files follow a [very similar pattern](https://github.com/Kitware/simput/blob/master/types/oscillator/src/convert.js):

* get a definition object, `histogram`, `autocorrelation` or `runParams`,
* get parameters from the object's keys,
* extract parameter values from the `value` field,
* copy them into an object or list of objects.

The only complication is in the `analyses`, where we have a some [dependent parameters](https://github.com/Kitware/simput/blob/master/types/oscillator/src/convert.js#L74-L86):

```js
    if (type === 'histogram') {
      // fill in associated fields.
      if (analysis.mesh === 'particles') {
        analysis.array = "velocityMagnitude";
        analysis.association="point";
      } else {
        analysis.array = "data";
        analysis.association="cell";
      }
      histogram.push(analysis);
    } else if (type === 'autocorrelation') {
      autocorrelation.push(analysis);
    }

```

For the `histogram` analysis, the `array` and `association` can be set based on the `mesh` parameter, and we don't have to bother the user with setting those parameters, and possibly getting an inconsistent input file for our simulation.

## Interaction, now in 3D!

The final piece of the oscillator puzzle is showing the user interactively what their inputs mean. The oscillators are placed in a 3D grid, and their radius varies over time based on the user's inputs. Next we will use the [Vue.js](https://vuejs.org/) framework and [vtk.js](https://kitware.github.io/vtk-js/index.html) to show a 3D interactive representation of the gaussian oscillators and their behavior over time.

To see what we're going to build in this section, take a look at the [application landing page](http://kitware.github.io/simput/app/) - the Oscillator image is captured from this widget. Or try it yourself - create some oscillators in the app, and scroll down to see the `3D view`:

<center class="half">
![](oscillator-step-3.png)
3D View
</center>

If you want to jump right in, take a look at the [code for this widget](https://github.com/Kitware/simput/tree/master/types/oscillator/src/widgets). First, let's look at how to hook up a custom widget in Simput.

### Add a definition

A few things get added to `model.js`:

```js
module.exports = {
  views: {
    oscillators: {
      // ...
      hooks: [
        // ...
        {
          type: 'oscillatorsToExternal',
        },
      ],
    },
    analyses: { ... },
    run: {
      attributes: ['runParams'],
      hooks: [
        {
          type: 'copyToExternal',
          src: 'data.run.0.runParams.gridsize.value.0',
          dst: 'viz.gridsize',
        },
        {
          type: 'copyToExternal',
          src: 'data.run.0.runParams.dt.value.0',
          dst: 'viz.timeStep',
        },
        {
          type: 'copyToExternal',
          src: 'data.run.0.runParams.endT.value.0',
          dst: 'viz.endTime',
        },
      ],
    },
  },
  definitions: {
    oscillator: { // ...
    },
    // ...
    oscillatorView: {
      parameters: [
        {
          id: 'viz',
          propType: 'ViewerWidget',
          size: 1,
          default: {
            text: '',
          },
          domain: {
            dynamic: true,
            external: 'viz',
          },
          label: 'Gaussians',
        },
      ],
    },
  },
};
```

First, we add a new `oscillatorView` definition, with a new `propType: 'ViewerWidget'`, and an external, dynamic `domain`. This is how we tell Simput to look for our external widget. The external domain `viz` is how we pass data to our widget to be displayed. To accomplish this, we add `hooks` to some of the views - the `run` view copies the `gridsize`, `dt` and `endT` parameters to keys in the `viz` object, and the `oscillators` view calls a special hook that we write in the file `hooks.js` next to our `model.js` file:

```js
// hooks.js
function getExternal(dataModel) {
  if (!dataModel.external) {
    dataModel.external = {};
  }
  if (!dataModel.external.viz) {
    dataModel.external.viz = {};
  }

  return dataModel.external;
}

function pushOscillatorsToExternalHook(hookConfig, dataModel, currentViewData) {
  const external = getExternal(dataModel);

  // Fill positions, radii
  if (dataModel.data.oscillators) {
    const oscillators = dataModel.data.oscillators;
    external.viz.oscillators = [];
    for (let i = 0; i < oscillators.length; i++) {
      if (oscillators[i].oscillator) {
        const osc = oscillators[i].oscillator;
        external.viz.oscillators.push({
          // default to zero if conversion doesn't work.
          center: osc.center.value.map((v) => Math.round(+v) || 0),
          name: osc.name.value[0],
          radius: +osc.radius.value[0] || 1,
          type: osc.type.value[0],
          omega0: +osc.omega0.value[0] || 1,
          zeta: osc.zeta.value ? (+osc.zeta.value[0] || 0) : 0,
          id: i,
        });
      }
    }
  }
}

module.exports = function initialize() {
  Simput.registerHook('oscillatorsToExternal', pushOscillatorsToExternalHook);
};
```

This setup results in the method `pushOscillatorsToExternalHook` being called *while the user is entering values*. As a result it must be tolerant to incomplete or invalid input - in this case, providing default values when the conversion to a number doesn't work.

### ViewerWidget

This data is passed to our custom widget, `ViewerWidget`, which is a Vue.js class. It lives in [a subdirectory of widgets](https://github.com/Kitware/simput/tree/master/types/oscillator/src/widgets/ViewerWidget). The `template.html` shows its structure:

```html
<div :class="$style.container">
  <div :class="$style.toolbar">
    <div :class="$style.line">
      <input
        type="range"
        min="0"
        :max="endTime"
        :step="timeStep"
        :value="timeSlider"
        :class="$style.slider"
        @input="setSliderTime(Number($event.target.value))"
      />
      <div
        :class="$style.resetCamera"
        @click="resetCamera"
      />
    </div>
  </div>
  <div
    ref="container"
    :class="$style.container"
  />
</div>
```

Basically a toolbar with a time slider and a reset button, and a container div. Some properties are marked using vue.js syntax as reactive - or linked to data values that change.

Next, the `script.js` shows how data values are passes to the template and to our vtk.js viewer, with some boiler-plate code removed here:

```js
import GaussianVTKViewer from '../GaussianVTKViewer';

export default {
  name: 'ViewerWidget',
  props: {
    prop: {
      required: true,
    },
    viewData: {
      required: true,
    },
  },
  data() {
    return {
      help: false,
      viewer: GaussianVTKViewer.newInstance(),
      timeSlider: 0,
    };
  },
  computed: {
    viewerData() {
      return Object.assign(
        {
          selected: this.viewData.id,
        },
        this.prop.ui.domain
      );
    },
    endTime() {
      return this.prop.ui.domain.endTime;
    },
    timeStep() {
      return this.prop.ui.domain.timeStep;
    },
  },
  watch: {
    viewerData(data) {
      this.viewer.setData(data);
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.viewer.setContainer(this.$refs.container);
      this.viewer.setData(this.viewerData);
    });
  },
  methods: {
    setSliderTime(value) {
      this.viewer.setTime(value);
      this.timeSlider = value;
    },
    resetCamera() {
      this.viewer.resetCamera();
    }
  },
};
```

The `external.viz` object that was filled in by hooks in our data model in the previous step is now provided to our widget as `this.prop.ui.domain`. We create our vtk.js `GaussianVTKViewer` as part of the Vue-standard `data()` method, and we provide data to `GaussianVTKViewer` by using `watch()` and `computed.viewerData()` to create a data object and call `this.viewer.setData(data)`. The time values from the slider in our template and the reaction to the reset camera button are also passed to the viewer.

### 3D view at last

Viewing objects in 3D is complex, and [GaussianVTKViewer.js](https://github.com/Kitware/simput/blob/master/types/oscillator/src/widgets/GaussianVTKViewer.js) reflects this, unfortunately for our 'simple' tutorial! Please browse through the source, to get an idea of how a [vtk.js](https://kitware.github.io/vtk-js/index.html) class can create and show geometry. The spheres are created by `createSpherePipeline(osc)`, and `gaussianVTKViewer(publicAPI, model)` sets up the initial rendering window and mouse interaction.

Let's take a look at how data changes are handled:

```js
publicAPI.setData = (data) => {
    // convert to integer.
    if (data.gridsize) data.gridsize = Math.floor(+data.gridsize) || 64;
    if (model.data !== data) {
      model.data = data;

      // update pipelines based on new info.
      if (model.cubePipeline) {
        const src = model.cubePipeline.cubeSource;
        if (src.getXLength() !== data.gridsize) {
          src.setXLength(data.gridsize);
          src.setYLength(data.gridsize);
          src.setZLength(data.gridsize);
          src.setCenter(
            data.gridsize / 2,
            data.gridsize / 2,
            data.gridsize / 2
          );
          // console.log('new gridsize', data.gridsize);
          publicAPI.resetCamera();
        }
      }

      if (data.oscillators) {
        publicAPI.removeAllActors();
        if (model.cubePipeline) publicAPI.addActor(model.cubePipeline.actor);
        model.spheres = [];
        data.oscillators.forEach((osc) => {
          const pipeline = createSpherePipeline(osc);
          model.spheres.push(pipeline);
          publicAPI.addActor(pipeline.actor);
        });
        publicAPI.setTime(model.time);
      }

      publicAPI.modified();
    }
  };
```

Again, this method is called while the user is changing values, so it must be tolerant of invalid input. In this case, it reacts to changes in `gridsize` by changing the bounding box and resetting the camera. Any changes in the oscillators are handled by rebuilding the list of spheres, and making sure they react to the current time setting from the time slider. The [publicAPI.setTime()](https://github.com/Kitware/simput/blob/master/types/oscillator/src/widgets/GaussianVTKViewer.js#L254-L287) method replicates some calculations from the C++ oscillator application, to set the radius of the spheres.

[Try the time slider!](http://kitware.github.io/simput/app/) If you set a small value for `dt`, and click the handle of the time slider, you can hold the left/right arrow keys to sweep through time values and see the oscillators vary their radii over time.

![](oscillator-step-4.png)

This vtk.js widget is an example of how external javascript libraries can be embedded in Simput types to enhance the presentation of your user's input. Other examples might be charts, graphs or other data visualization.

## Wrapup

You now have all the tools and pieces you need to create a new type for Simput, which will simplify life for your users every time they need to create another simulation input file. Please [let us know](https://github.com/Kitware/simput/issues) of any problems you find or feedback you have about this tutorial or Simput in general, or [dive in](https://kitware.github.io/simput/docs/develop_build.html) and contribute to Simput, and everyone will benefit!
