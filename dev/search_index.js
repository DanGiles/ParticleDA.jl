var documenterSearchIndex = {"docs":
[{"location":"#ParticleDA.jl","page":"ParticleDA.jl","title":"ParticleDA.jl","text":"","category":"section"},{"location":"","page":"ParticleDA.jl","title":"ParticleDA.jl","text":"ParticleDA.jl is a Julia package to run data assimilation with particle filter distributed using MPI.","category":"page"},{"location":"#Installation","page":"ParticleDA.jl","title":"Installation","text":"","category":"section"},{"location":"","page":"ParticleDA.jl","title":"ParticleDA.jl","text":"To install the package, open Julia's REPL, enter the package manager with ], then run the command","category":"page"},{"location":"","page":"ParticleDA.jl","title":"ParticleDA.jl","text":"add https://github.com/Team-RADDISH/ParticleDA.jl.git","category":"page"},{"location":"","page":"ParticleDA.jl","title":"ParticleDA.jl","text":"If you plan to develop the package (make changes, submit pull requests, etc), in the package manager mode run this command","category":"page"},{"location":"","page":"ParticleDA.jl","title":"ParticleDA.jl","text":"dev https://github.com/Team-RADDISH/ParticleDA.jl.git","category":"page"},{"location":"","page":"ParticleDA.jl","title":"ParticleDA.jl","text":"This will automatically clone the repository to your local directory ~/.julia/dev/ParticleDA.","category":"page"},{"location":"","page":"ParticleDA.jl","title":"ParticleDA.jl","text":"You can exit from the package manager mode by pressing CTRL + C or, alternatively, the backspace key when there is no input in the prompt.","category":"page"},{"location":"#Usage","page":"ParticleDA.jl","title":"Usage","text":"","category":"section"},{"location":"","page":"ParticleDA.jl","title":"ParticleDA.jl","text":"After installing the package, you can start using it in Julia's REPL with","category":"page"},{"location":"","page":"ParticleDA.jl","title":"ParticleDA.jl","text":"using ParticleDA","category":"page"},{"location":"","page":"ParticleDA.jl","title":"ParticleDA.jl","text":"The run the particle filter you can use the function run_particle_filter:","category":"page"},{"location":"","page":"ParticleDA.jl","title":"ParticleDA.jl","text":"run_particle_filter","category":"page"},{"location":"#ParticleDA.run_particle_filter","page":"ParticleDA.jl","title":"ParticleDA.run_particle_filter","text":"run_particle_filter(init, path_to_input_file::String, filter_type::ParticleFilter)\n\nRun the particle filter.  init is the function which initialise the model, path_to_input_file is the path to the YAML file with the input parameters. filter_type is the particle filter to use.  See ParticleFilter for the possible values.\n\n\n\n\n\nrun_particle_filter(init, user_input_dict::Dict, filter_type::ParticleFilter)\n\nRun the particle filter.  init is the function which initialise the model, user_input_dict is the list of input parameters, as a Dict.  filter_type is the particle filter to use.  See ParticleFilter for the possible values.\n\n\n\n\n\n","category":"function"},{"location":"","page":"ParticleDA.jl","title":"ParticleDA.jl","text":"The next section details how to write the interface between the model and the particle filter.","category":"page"},{"location":"#Interfacing-the-model","page":"ParticleDA.jl","title":"Interfacing the model","text":"","category":"section"},{"location":"","page":"ParticleDA.jl","title":"ParticleDA.jl","text":"The model needs to define a custom data structure and a few functions, that will be used by run_particle_filter:","category":"page"},{"location":"","page":"ParticleDA.jl","title":"ParticleDA.jl","text":"a custom structure which holds the data about the model.  This will be used to dispatch the methods to be defined, listed below;\nan initialisation function with the following signature:\ninit(model_params_dict, nprt_per_rank, my_rank) -> model_data\nThe arguments are\nmodel_params_dict: the dictionary with the parameters of the model\nnprt_per_rank: the number or particle per each MPI rank\nmy_rank: the value of the current MPI rank\nThis initialisation function must create an instance of the model data structure and return it.\nthe model needs to extend the following methods, using the custom model data structure for dispatch:","category":"page"},{"location":"","page":"ParticleDA.jl","title":"ParticleDA.jl","text":"ParticleDA.get_grid_size\nParticleDA.get_n_state_var\nParticleDA.get_particles\nParticleDA.get_truth\nParticleDA.update_truth!\nParticleDA.update_particle_dynamics!\nParticleDA.update_particle_noise!\nParticleDA.get_particle_observations!\nParticleDA.write_snapshot","category":"page"},{"location":"#ParticleDA.get_grid_size","page":"ParticleDA.jl","title":"ParticleDA.get_grid_size","text":"ParticleDA.get_grid_size(model_data) -> NTuple{N, Int} where N\n\nReturn a tuple with the dimensions (number of nodes) of the grid.\n\n\n\n\n\n","category":"function"},{"location":"#ParticleDA.get_n_state_var","page":"ParticleDA.jl","title":"ParticleDA.get_n_state_var","text":"ParticleDA.get_n_state_var(model_data) -> Int\n\nReturn the number of state variables.\n\n\n\n\n\n","category":"function"},{"location":"#ParticleDA.get_particles","page":"ParticleDA.jl","title":"ParticleDA.get_particles","text":"ParticleDA.get_particle(model_data) -> particles\n\nReturn the vector of particles.  This method is intended to be extended by the user with the above signature, specifying the type of model_data.  Note: this function should return the vector of particles itself and not a copy, because it will be modified in-place.\n\n\n\n\n\n","category":"function"},{"location":"#ParticleDA.get_truth","page":"ParticleDA.jl","title":"ParticleDA.get_truth","text":"ParticleDA.get_truth(model_data) -> truth_observations\n\nReturn the vector of true observations.  This method is intended to be extended by the user with the above signature, specifying the type of model_data.\n\n\n\n\n\n","category":"function"},{"location":"#ParticleDA.update_truth!","page":"ParticleDA.jl","title":"ParticleDA.update_truth!","text":"ParticleDA.update_truth!(model_data, nprt_per_rank::Int) -> truth_observations\n\nUpdate the true observations using the dynamic of the model and return the vector of the true observations.  nprt_per_rank is the number of particles per each MPI rank.  This method is intended to be extended by the user with the above signature, specifying the type of model_data.\n\n\n\n\n\n","category":"function"},{"location":"#ParticleDA.update_particle_dynamics!","page":"ParticleDA.jl","title":"ParticleDA.update_particle_dynamics!","text":"ParticleDA.update_particle_dynamics!(model_data, nprt_per_rank::Int)\n\nUpdate the particles using the dynamic of the model.  nprt_per_rank is the number of particles per each MPI rank.  This method is intended to be extended by the user with the above signature, specifying the type of model_data.\n\n\n\n\n\n","category":"function"},{"location":"#ParticleDA.update_particle_noise!","page":"ParticleDA.jl","title":"ParticleDA.update_particle_noise!","text":"ParticleDA.update_particle_noise!(model_data, nprt_per_rank::Int)\n\nUpdate the particles using the noise of the model and return the vector of the particles.  nprt_per_rank is the number of particles per each MPI rank.  This method is intended to be extended by the user with the above signature, specifying the type of model_data.\n\n\n\n\n\n","category":"function"},{"location":"#ParticleDA.get_particle_observations!","page":"ParticleDA.jl","title":"ParticleDA.get_particle_observations!","text":"ParticleDA.get_particle_observations!(model_data, nprt_per_rank::Int) -> particles_observations\n\nReturn the vector of the particles observations.  nprt_per_rank is the number of particles per each MPI rank.  This method is intended to be extended by the user with the above signature, specifying the type of model_data.\n\n\n\n\n\n","category":"function"},{"location":"#ParticleDA.write_snapshot","page":"ParticleDA.jl","title":"ParticleDA.write_snapshot","text":"ParticleDA.write_snapshot(output_filename, model_data, avg_arr, var_arr, weights, it)\n\nWrite a snapshot of the data after an update of the particles to the HDF5 file output_filename.  avg_arr is the array of the mean of the particles, var_arr is the array of the standard deviation of the particles, weights is the array of the weigths of the particles, it is the index of the time step (it==0 is the initial state, before moving forward the model for the first time).  This method is intended to be extended by the user with the above signature, specifying the type of model_data.\n\n\n\n\n\n","category":"function"},{"location":"#Input-parameters","page":"ParticleDA.jl","title":"Input parameters","text":"","category":"section"},{"location":"","page":"ParticleDA.jl","title":"ParticleDA.jl","text":"You can store the input parameters in an YAML file with the following structure","category":"page"},{"location":"","page":"ParticleDA.jl","title":"ParticleDA.jl","text":"filter:\n  key1: value1\n\nmodel:\n  model_name1:\n    key2: value2\n    key3: value3\n  model_name2:\n    key4: value4\n    key5: value5","category":"page"},{"location":"","page":"ParticleDA.jl","title":"ParticleDA.jl","text":"The parameters under filter are related to the particle filter, under model you can specify the parameters for different models.","category":"page"},{"location":"","page":"ParticleDA.jl","title":"ParticleDA.jl","text":"The particle filter parameters are saved in the following data structure:","category":"page"},{"location":"","page":"ParticleDA.jl","title":"ParticleDA.jl","text":"ParticleDA.FilterParameters","category":"page"},{"location":"#ParticleDA.Default_params.FilterParameters","page":"ParticleDA.jl","title":"ParticleDA.Default_params.FilterParameters","text":"Parameters()\n\nParameters for ParticleDA run. Keyword arguments:\n\nmaster_rank : Id of MPI rank that performs serial computations\nn_time_step::Int : Number of time steps. On each time step we update the forward model forecast, get model observations, and weight and resample particles.\nverbose::Bool : Flag to control whether to write output\noutput_filename::String : Name of output file\nnprt::Int : Number of particles for particle filter\nweight_std: Standard deviation of the distribution of the weights\nrandom_seed::Int : Seed number for the pseudorandom number generator\nenable_timers::Bool : Flag to control run time measurements\n\n\n\n\n\n","category":"type"},{"location":"#Example:-tsunami-modelling-with-the-bootstrap-filter","page":"ParticleDA.jl","title":"Example: tsunami modelling with the bootstrap filter","text":"","category":"section"},{"location":"","page":"ParticleDA.jl","title":"ParticleDA.jl","text":"A full example of a model interfacing ParticleDA is available in test/model/model.jl.  This model represents a tsunami and is partly based on the tsunami data assimilation code by Takuto Maeda.  You can run it with","category":"page"},{"location":"","page":"ParticleDA.jl","title":"ParticleDA.jl","text":"# Load ParticleDA\nusing ParticleDA\n\n# Save some variables for later use\ntest_dir = joinpath(dirname(pathof(ParticleDA)), \"..\", \"test\")\nmodule_src = joinpath(test_dir, \"model\", \"model.jl\")\ninput_file = joinpath(test_dir, \"integration_test_1.yaml\")\n\n# Instantiate the test environment\nusing Pkg\nPkg.activate(test_dir)\nPkg.instantiate()\n\n# Include the sample model source code and load it\ninclude(module_src)\nusing .Model\n\n# Run the particle filter using the `init` file defined in the `Model` module.\nrun_particle_filter(Model.init, input_file, BootstrapFilter())","category":"page"},{"location":"#Parameters-of-the-test-model","page":"ParticleDA.jl","title":"Parameters of the test model","text":"","category":"section"},{"location":"","page":"ParticleDA.jl","title":"ParticleDA.jl","text":"The Input parameters section shows how to pass the input parameters for the filter and the model.  For the model included in the test suite, called llw2d, you can set the following parameters:","category":"page"},{"location":"","page":"ParticleDA.jl","title":"ParticleDA.jl","text":"Model.ModelParameters","category":"page"},{"location":"#Main.Model.ModelParameters","page":"ParticleDA.jl","title":"Main.Model.ModelParameters","text":"ModelParameters()\n\nParameters for the model. Keyword arguments:\n\nnx::Int : Number of grid points in the x direction\nny::Int : Number of grid points in the y direction\nx_length::AbstractFloat : Domain size (m) in the x direction\ny_length::AbstractFloat : Domain size (m) in the y direction\ndx::AbstractFloat : Distance (m) between grid points in the x direction\ndy::AbstractFloat : Distance (m) between grid points in the y direction\nn_state_var::Int: Number of variables in the state vector\nnobs::Int : Number of observation stations\nstation_filename::String : Name of input file for station coordinates\nstation_distance_x::Float : Distance between stations in the x direction [m]\nstation_distance_y::Float : Distance between stations in the y direction [m]\nstation_boundary_x::Float : Distance between bottom left edge of box and first station in the x direction [m]\nstation_boundary_y::Float : Distance between bottom left edge of box and first station in the y direction [m]\nn_integration_step::Int : Number of sub-steps to integrate the forward model per time step.\ntime_step::AbstractFloat : Time step length (s)\nstate_prefix::String : Prefix of the time slice data groups in output\ntitle_da::String : Suffix of the data assimilated data group in output\ntitle_syn::String : Suffix of the true state data group in output\ntitle_grid::String : Name of the grid data group in output\ntitle_stations::String : Name of the station coordinates data group in output\ntitle_params::String : Name of the parameters data group in output\nsource_size::AbstractFloat : Initial condition parameter\nbathymetry_setup::AbstractFloat : Bathymetry set-up.\nlambda::AbstractFloat : Length scale for Matérn covariance kernel in background noise\nnu::AbstractFloat : Smoothess parameter for Matérn covariance kernel in background noise\nsigma::AbstractFloat : Marginal standard deviation for Matérn covariance kernel in background noise\nlambda_initial_state::AbstractFloat : Length scale for Matérn covariance kernel in initial state of particles\nnu_initial_state::AbstractFloat : Smoothess parameter for Matérn covariance kernel in initial state of particles\nsigma_initial_state::AbstractFloat : Marginal standard deviation for Matérn covariance kernel in initial state of particles\npadding::Int : Min padding for circulant embedding gaussian random field generator\nprimes::Int: Whether the size of the minimum circulant embedding of the covariance matrix can be written as a product of small primes (2, 3, 5 and 7). Default is true.\nparticle_initial_state::String : Initial state of the particles before noise is added. Possible options are\n\"zero\" : initialise height and velocity to 0 everywhere\n\"true\" : copy the true initial state\nabsorber_thickness_fraction::Float : Thickness of absorber for sponge absorbing boundary conditions, fraction of grid size\nboundary_damping::Float : damping for boundaries\ncutoff_depth::Float : Shallowest water depth\nobs_noise_std::Float: Standard deviation of noise added to observations of the true state\nparticle_dump_file::String: file name for dump of particle state vectors\nparticle_dump_time::Int: list of (one more more) time steps to dump particle states\n\n\n\n\n\n","category":"type"},{"location":"#Observation-Station-Coordinates","page":"ParticleDA.jl","title":"Observation Station Coordinates","text":"","category":"section"},{"location":"","page":"ParticleDA.jl","title":"ParticleDA.jl","text":"The coordinates of the observation stations can be set in two different ways. Either way, the parameter nobs should be set to the total number of observation stations.","category":"page"},{"location":"","page":"ParticleDA.jl","title":"ParticleDA.jl","text":"Provide the coordinates in an input file. Set the parameter station_filename to the name of your input file. The input file is in plain text, the format is one row per station containing x, y - coordinates in metres. Here is a simple example with two stations\n# Comment lines starting with '#' will be ignored by the code\n# This file contains two stations: at [1km, 1km] and [2km, 2km]\n1.0e3, 1.0e3\n2.0e3, 2.0e3\nProvide parameters for an array of observation stations. The values of these parameters should be set:\nstation_distance_x : Distance between stations in the x direction [m]\nstation_distance_y : Distance between stations in the y direction [m]\nstation_boundary_x : Distance between bottom left edge of box and first station in the x direction [m]\nstation_boundary_y : Distance between bottom left edge of box and first station in the y direction [m]\nAs an example, one could set\nnobs : 4\nstation_distance_x : 1.0e3\nstation_distance_y : 1.0e3\nstation_boundary_x : 10.0e3\nstation_boundary_y : 10.0e3\nto generate 4 stations at [10km, 10km], [10km, 11km], [11km, 10km] and [11km, 11km]. Note that when using this method, the square root of nobs has to be an integer.","category":"page"},{"location":"#Output","page":"ParticleDA.jl","title":"Output","text":"","category":"section"},{"location":"","page":"ParticleDA.jl","title":"ParticleDA.jl","text":"If the particle filter parameter verbose is set to true, run_particle_filter will produce an HDF5 file in the run directory. The file name is particle_da.h5 by default. The file contains the true and assimilated ocean height, particle weights, parameters used, and other metadata at each data assimilation time step. To read the output file, use the HDF5 library.","category":"page"},{"location":"","page":"ParticleDA.jl","title":"ParticleDA.jl","text":"A basic plotting tool is provided in a jupyter notebook. This is intended as a template to build more sophisticated postprocessing tools, but can be used for some simple analysis. Set the variable timestamp in the third cell to plot different time slices from the output file. More functionality may be added as the package develops.","category":"page"},{"location":"#Running-in-Parallel","page":"ParticleDA.jl","title":"Running in Parallel","text":"","category":"section"},{"location":"","page":"ParticleDA.jl","title":"ParticleDA.jl","text":"The particle state update is parallelised using both MPI and threading. According to our preliminary tests both methods work well at small scale. To use the threading, set the environment variable JULIA_NUM_THREADS to the number of threads you want to use before starting julia and then call the run_particle_filter function normally. You can check the number of threads julia has available by calling in Julia's REPL","category":"page"},{"location":"","page":"ParticleDA.jl","title":"ParticleDA.jl","text":"Threads.nthreads()","category":"page"},{"location":"","page":"ParticleDA.jl","title":"ParticleDA.jl","text":"To use the MPI parallelisation, write a julia script that calls the tdac() function and run it in an unix shell with","category":"page"},{"location":"","page":"ParticleDA.jl","title":"ParticleDA.jl","text":"mpirun -np <your_number_of_processes> julia <your_julia_script>","category":"page"},{"location":"","page":"ParticleDA.jl","title":"ParticleDA.jl","text":"Note that the parallel performance may vary depending on the performance of the algorithm. In general, a degeneracy of the particle weights will lead to poor load balance and parallel performance. See this issue for more details.","category":"page"},{"location":"#Testing","page":"ParticleDA.jl","title":"Testing","text":"","category":"section"},{"location":"","page":"ParticleDA.jl","title":"ParticleDA.jl","text":"We have a basic test suite for ParticleDA.jl.  You can run the tests by entering the package manager mode in Julia's REPL with ] and running the command","category":"page"},{"location":"","page":"ParticleDA.jl","title":"ParticleDA.jl","text":"test ParticleDA","category":"page"},{"location":"#License","page":"ParticleDA.jl","title":"License","text":"","category":"section"},{"location":"","page":"ParticleDA.jl","title":"ParticleDA.jl","text":"The ParticleDA.jl package is licensed under the MIT \"Expat\" License.","category":"page"}]
}
