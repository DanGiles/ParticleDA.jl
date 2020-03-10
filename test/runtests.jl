using TDAC
using LinearAlgebra, Test

@testset "Matrix_ls" begin
    using TDAC.Matrix_ls

    ### gs!
    n = 5

    m = float(collect(I(n)))
    a = Vector{Float64}(undef, n)
    v = ones(n)
    Matrix_ls.gs!(a, m, v)
    @test a == v
    v = zeros(n)
    Matrix_ls.gs!(a, m, v)
    @test a == v
    v = randn(n)
    Matrix_ls.gs!(a, m, v)
    @test a ≈ v

    v = randn(n)
    m = v .* I(5)
    Matrix_ls.gs!(a, m, v)
    @test a ≈ ones(n)

    v0 = 1.0:5.0
    m = v0 .* I(5)
    v = randn(n)
    Matrix_ls.gs!(a, m, v)
    @test a ≈ v ./ v0

    m = reshape(1.0:(n^2), (n,n)) ./ 10
    m[diagind(m)] *= 1e2
    v = 1.0:5.0
    Matrix_ls.gs!(a, m, v)
    @test a ≈ [0.08863042084147274, 0.02683554264812562, 0.022082135935372775,
               0.020330901243131676, 0.019420256962167263]

    m = reshape(1.0:(n^2), (n,n))
    v = (1.0:5.0) .^ 2
    @test_throws ErrorException Matrix_ls.gs!(a, m, v)
end

@testset "LLW2d" begin
    using TDAC.LLW2d

    dx = dy = 2e3
    
    ### set_stations!
    ist = Vector{Int}(undef, 4)
    jst = Vector{Int}(undef, 4)
    LLW2d.set_stations!(ist, jst, 20, 150, 1e3, 1e3, dx, dy)                         
    @test ist == [75, 75, 85, 85]
    @test jst == [75, 85, 75, 85]
    ist = rand(Int, 9)
    jst = rand(Int, 9)
    LLW2d.set_stations!(ist, jst, 20, 150, 1e3, 1e3, dx, dy)

    @test ist == [75, 75, 75, 85, 85, 85, 95, 95, 95]
    @test jst == [75, 85, 95, 75, 85, 95, 75, 85, 95]

    ### initheight!
    eta = ones(2, 2)
    hh  = ones(2, 2)
    LLW2d.initheight!(eta, hh, dx, dy, 3e4)
    @test eta ≈ [0.978266982572228  0.9463188389826958;
                 0.9463188389826958 0.9154140546161575]
    eta = ones(2, 2)
    hh  = zeros(2, 2)
    LLW2d.initheight!(eta, hh, dx, dy, 3e4)
    @test eta ≈ zeros(2, 2)

    # timestep.  TODO: add real tests.  So far we're just making sure code won't
    # crash
    n = 200
    eta1 = rand(n, n)
    mm1 = rand(n, n)
    nn1 = rand(n, n)
    eta0 = rand(n, n)
    mm0 = rand(n, n)
    nn0 = rand(n, n)
    hn = rand(n, n)
    hm = rand(n, n)
    fm = rand(n, n)
    fn = rand(n, n)
    fe = rand(n,n)
    gg = rand(n,n)
    LLW2d.timestep!(eta1, mm1, nn1, eta0, mm0, nn0, hm, hn, fm, fn, fe, gg, dx, dy, 1)

    # setup.  TODO: add real tests.  So far we're just making sure code won't
    # crash
    LLW2d.setup(200, 200, 3e4)
end

@testset "TDAC" begin
    dx = dy = 2e3
    
    @test TDAC.get_distance(3/2000, 4/2000, 0, 0, dx, dy) == 5
    @test TDAC.get_distance(10, 23, 5, 11, dx, dy) == 26000.0

    x = Vector(1.:9.)
    # stations at (1,1) (2,2) and (3,3) return diagonal of x[3,3]
    ist = [1,2,3]
    jst = [1,2,3]
    obs = Vector{Float64}(undef, 3)
    TDAC.get_obs!(obs,x,3,ist,jst)
    @test obs ≈ [1.,5.,9.]

    # Observation covariances are ~exp(-sqrt(dx^2+dy^2)/r) 
    d11 = exp(-(sqrt(0.8e7) * 5e-5) ^ 2)
    d22 = exp(-(sqrt(3.2e7) * 5e-5) ^ 2)
    @test TDAC.get_obs_covariance(3,5.0e-5,dx,dy,ist,jst) ≈ [1.0 d11 d22; d11 1.0 d11; d22 d11 1.0]

    y = [1.0, 2.0]
    cov_obs = float(I(2))
    weights = Vector{Float64}(undef, 3)
    # model observations with equal distance from true observation return equal weights
    hx = [0.5 0.9 1.5; 2.1 2.5 1.9]
    TDAC.get_weights!(weights, y, hx, cov_obs)
    @test weights ≈ ones(3) / 3
    # model observations with decreasing distance from true observation return decreasing weights
    hx = [0.9 0.5 1.5; 2.1 2.5 3.5]
    TDAC.get_weights!(weights, y, hx, cov_obs)
    @test weights[1] > weights[2] > weights[3]
    # TODO: test with cov != I

    x = reshape(Vector(1.:10.),2,5)
    xrs = zero(x)
    # equal weights return the same particles
    w = ones(5) * .2
    TDAC.resample!(xrs,x,w)
    @test xrs ≈ x
    # weight of 1.0 on first particle returns only copies of that particle
    w = zeros(5)
    w[1] = 1.0
    TDAC.resample!(xrs,x,w)
    @test xrs ≈ ones(2,5) .* x[:,1]
    # weight of 1.0 on last particle returns only copies of that particle
    w = zeros(5)
    w[end] = 1.0
    TDAC.resample!(xrs,x,w)
    @test xrs ≈ ones(2,5) .* x[:,end]
    # weights of .4 and .6 on particles 2 and 4 return a 40/60 mix of those particles
    w = zeros(5)
    w[2] = .4
    w[4] = .6
    TDAC.resample!(xrs,x,w)
    @test sum(xrs, dims=2)[:] ≈ 2 .* x[:,2] + 3 .* x[:,4]
    
    nx = 3
    ny = 3
    dt = 1.0
    # 0 input gives 0 output
    # TODO: Not sure if this does anything sensible since LLW2d.setup() has not been called
    #       At the very least it checks that tsunami_update! doesn't crash
    x0 = x = zeros(nx * ny * 3)
    hm = hn = fm = fn = fe = gg = zeros(nx,ny)
    TDAC.tsunami_update!(x, nx, ny, dx, dy, dt, hm, hn, fm, fn, fe, gg)
    @test x ≈ x0
end
