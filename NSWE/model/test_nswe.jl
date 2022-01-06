# Load ParticleDA
using ParticleDA
#
# # Save some variables for later use
nswe_dir = joinpath("NSWE")
test_dir = joinpath("test")
# module_src = joinpath(test_dir, "model", "nonlinear_model.jl")
module_src = joinpath(test_dir, "model", "model.jl")
# input_file = joinpath(ARGS[1])
input_file = joinpath(test_dir,"tsunami.yaml")

# # Instantiate the test environment
using Pkg
Pkg.activate(test_dir)
Pkg.instantiate()

# Include the sample model source code and load it
include(module_src)
using .Model
run_particle_filter(Model.init, input_file, OptimalFilter())