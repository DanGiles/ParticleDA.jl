using .Default_params

function create_or_open_group(file::HDF5.File, group_name::String, subgroup_name::String = "None")

    if !haskey(file, group_name)
        group = create_group(file, group_name)
    else
        group = open_group(file, group_name)
    end

    if subgroup_name != "None"
        if !haskey(group, subgroup_name)
            subgroup = create_group(group, subgroup_name)
        else
            subgroup = open_group(group, subgroup_name)
        end
    else
        subgroup = nothing
    end

    return group, subgroup

end

function write_timers(lengths::Vector{Int}, size::Int, chars::AbstractVector{UInt8}, params::FilterParameters)

    write_timers(lengths, size, chars, params.output_filename)

end

function write_timers(lengths::Vector{Int}, size::Int, chars::AbstractVector{UInt8}, filename::String)

    group_name = "timer"

    h5open(filename, "cw") do file

        if !haskey(file, group_name)
            group = create_group(file, group_name)
        else
            group = open_group(file, group_name)
        end

        sum_lengths = cumsum(lengths)
        for i in 1:size
            timer_string = String(chars[1 + (i > 1 ? sum_lengths[i - 1] : 0):sum_lengths[i]])
            dataset_name = "rank" * string(i-1)

            if !haskey(group, dataset_name)
                group[dataset_name] = timer_string
            else
                @warn "Write failed, dataset " * group_name * "/" * dataset_name *  " already exists in " * file.filename * "!"
            end
        end
    end
end
