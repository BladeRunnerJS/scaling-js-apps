# Workshop setup notes

# Creating starting point app

To create the starting point app from the finished example:

- `cd chat-bladeset/blades`
- `rm -rf messages usercard input`
- `cd ../../default-aspect`
- >> edit 'src/modularapp/App.js'
	- delete code below "// Add other Blades here"
	- delete code for deleted blades at "// require Blades"
- this should be kept in the starting point branch of https://github.com/BladeRunnerJS/modularapp
- or delete the .git directory if its going to be copied/pushed elsewhere

# Creating the required GitHub repos

- `git clone https://github.com/BladeRunnerJS/modularapp`
- `cd modularapp`
- `git checkout starting-point`
- `rm -rf .git`
- `git init`
- for each 'company':
  - `git remote add <company-name>` https://github.com/BladeRunnerJS/futurejs-modularapp-<Company Name>
  - `git push origin <company-name>`
  - remember to create the GitHub repo first; it should probably be a private repo
  - create a new team called `futurejs-workshop-<Company Name>`
  - assign this team to the new repo, team members will be added during the workshop

# Creating the USB sticks

- `wget -m https://bladerunnerjs.github.io/scaling-js-apps/`

- for each 'company'/USB stick (running commands from within the USB stick path)
 - `git clone --bare https://github.com/BladeRunnerJS/futurejs-modularapp-<Company Name>`
 - `cp -r <path to bladerunnerjs.github.io mirror> ./`

# During the workshop - adding team members

- for each company:
  - add the correct GitHub usernames to the team
