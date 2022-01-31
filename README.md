# Interactive Graphics with React and D3

<p>
This repo contains tests, trials, and tips for practices while adding D3
graphs to a React app.
</p>
<p>
Integrating a D3 graph into a React app means to build a React component
for a visulaization that can 1. fetch data, and on user input 2. it can
update its data smoothly and use it to animate its graph.
</p>
<p>
Since the React component lifecycles and D3's data update 
<a href="https://github.com/d3/d3-selection/blob/main/README.md#joining-data">
    methods
</a> 
are quite different, I chose to seperate the data fetch/update part from
the visulaization/animation part. The pattern of main component for data
handling with sub component for visulaization is used in the examples
below.
</p>
<p>
Another tip to reduce the friction between React and D3 component
lifecycles is trying to minimize re-renders in the data viz
subcomponent, specifically by using less React hooks that updates the
state and causing a re-render like <code>useState</code> and using more
lighter hooks like <code>useRef</code> and <code>useMemo</code>.
</p>
<p>
I hope the demos here can help illustrate successful integration of
React and D3 in terms of both smooth data handling and data viz
animation.
</p>

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

Serve using `serve -s build`
