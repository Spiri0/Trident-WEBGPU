# CMAKE generated file: DO NOT EDIT!
# Generated by "Unix Makefiles" Generator, CMake Version 3.30

# Delete rule output on recipe failure.
.DELETE_ON_ERROR:

#=============================================================================
# Special targets provided by cmake.

# Disable implicit rules so canonical targets will work.
.SUFFIXES:

# Disable VCS-based implicit rules.
% : %,v

# Disable VCS-based implicit rules.
% : RCS/%

# Disable VCS-based implicit rules.
% : RCS/%,v

# Disable VCS-based implicit rules.
% : SCCS/s.%

# Disable VCS-based implicit rules.
% : s.%

.SUFFIXES: .hpux_make_needs_suffix_list

# Command-line flag to silence nested $(MAKE).
$(VERBOSE)MAKESILENT = -s

#Suppress display of executed commands.
$(VERBOSE).SILENT:

# A target that is always out of date.
cmake_force:
.PHONY : cmake_force

#=============================================================================
# Set environment variables for the build.

# The shell in which to execute make rules.
SHELL = /bin/sh

# The CMake executable.
CMAKE_COMMAND = /usr/local/Cellar/cmake/3.30.1/bin/cmake

# The command to remove a file.
RM = /usr/local/Cellar/cmake/3.30.1/bin/cmake -E rm -f

# Escaping for special characters.
EQUALS = =

# The top-level source directory on which CMake was run.
CMAKE_SOURCE_DIR = /Users/mac/Downloads/temp/Trident-WEBGPU/src/plugins/meshlets/metis-5.1.0/repo

# The top-level build directory on which CMake was run.
CMAKE_BINARY_DIR = /Users/mac/Downloads/temp/Trident-WEBGPU/src/plugins/meshlets/metis-5.1.0/repo/build

# Include any dependencies generated for this target.
include programs/CMakeFiles/graphchk.dir/depend.make
# Include any dependencies generated by the compiler for this target.
include programs/CMakeFiles/graphchk.dir/compiler_depend.make

# Include the progress variables for this target.
include programs/CMakeFiles/graphchk.dir/progress.make

# Include the compile flags for this target's objects.
include programs/CMakeFiles/graphchk.dir/flags.make

programs/CMakeFiles/graphchk.dir/graphchk.c.o: programs/CMakeFiles/graphchk.dir/flags.make
programs/CMakeFiles/graphchk.dir/graphchk.c.o: /Users/mac/Downloads/temp/Trident-WEBGPU/src/plugins/meshlets/metis-5.1.0/repo/programs/graphchk.c
programs/CMakeFiles/graphchk.dir/graphchk.c.o: programs/CMakeFiles/graphchk.dir/compiler_depend.ts
	@$(CMAKE_COMMAND) -E cmake_echo_color "--switch=$(COLOR)" --green --progress-dir=/Users/mac/Downloads/temp/Trident-WEBGPU/src/plugins/meshlets/metis-5.1.0/repo/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_1) "Building C object programs/CMakeFiles/graphchk.dir/graphchk.c.o"
	cd /Users/mac/Downloads/temp/Trident-WEBGPU/src/plugins/meshlets/metis-5.1.0/repo/build/programs && /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/cc $(C_DEFINES) $(C_INCLUDES) $(C_FLAGS) -MD -MT programs/CMakeFiles/graphchk.dir/graphchk.c.o -MF CMakeFiles/graphchk.dir/graphchk.c.o.d -o CMakeFiles/graphchk.dir/graphchk.c.o -c /Users/mac/Downloads/temp/Trident-WEBGPU/src/plugins/meshlets/metis-5.1.0/repo/programs/graphchk.c

programs/CMakeFiles/graphchk.dir/graphchk.c.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color "--switch=$(COLOR)" --green "Preprocessing C source to CMakeFiles/graphchk.dir/graphchk.c.i"
	cd /Users/mac/Downloads/temp/Trident-WEBGPU/src/plugins/meshlets/metis-5.1.0/repo/build/programs && /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/cc $(C_DEFINES) $(C_INCLUDES) $(C_FLAGS) -E /Users/mac/Downloads/temp/Trident-WEBGPU/src/plugins/meshlets/metis-5.1.0/repo/programs/graphchk.c > CMakeFiles/graphchk.dir/graphchk.c.i

programs/CMakeFiles/graphchk.dir/graphchk.c.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color "--switch=$(COLOR)" --green "Compiling C source to assembly CMakeFiles/graphchk.dir/graphchk.c.s"
	cd /Users/mac/Downloads/temp/Trident-WEBGPU/src/plugins/meshlets/metis-5.1.0/repo/build/programs && /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/cc $(C_DEFINES) $(C_INCLUDES) $(C_FLAGS) -S /Users/mac/Downloads/temp/Trident-WEBGPU/src/plugins/meshlets/metis-5.1.0/repo/programs/graphchk.c -o CMakeFiles/graphchk.dir/graphchk.c.s

programs/CMakeFiles/graphchk.dir/io.c.o: programs/CMakeFiles/graphchk.dir/flags.make
programs/CMakeFiles/graphchk.dir/io.c.o: /Users/mac/Downloads/temp/Trident-WEBGPU/src/plugins/meshlets/metis-5.1.0/repo/programs/io.c
programs/CMakeFiles/graphchk.dir/io.c.o: programs/CMakeFiles/graphchk.dir/compiler_depend.ts
	@$(CMAKE_COMMAND) -E cmake_echo_color "--switch=$(COLOR)" --green --progress-dir=/Users/mac/Downloads/temp/Trident-WEBGPU/src/plugins/meshlets/metis-5.1.0/repo/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_2) "Building C object programs/CMakeFiles/graphchk.dir/io.c.o"
	cd /Users/mac/Downloads/temp/Trident-WEBGPU/src/plugins/meshlets/metis-5.1.0/repo/build/programs && /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/cc $(C_DEFINES) $(C_INCLUDES) $(C_FLAGS) -MD -MT programs/CMakeFiles/graphchk.dir/io.c.o -MF CMakeFiles/graphchk.dir/io.c.o.d -o CMakeFiles/graphchk.dir/io.c.o -c /Users/mac/Downloads/temp/Trident-WEBGPU/src/plugins/meshlets/metis-5.1.0/repo/programs/io.c

programs/CMakeFiles/graphchk.dir/io.c.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color "--switch=$(COLOR)" --green "Preprocessing C source to CMakeFiles/graphchk.dir/io.c.i"
	cd /Users/mac/Downloads/temp/Trident-WEBGPU/src/plugins/meshlets/metis-5.1.0/repo/build/programs && /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/cc $(C_DEFINES) $(C_INCLUDES) $(C_FLAGS) -E /Users/mac/Downloads/temp/Trident-WEBGPU/src/plugins/meshlets/metis-5.1.0/repo/programs/io.c > CMakeFiles/graphchk.dir/io.c.i

programs/CMakeFiles/graphchk.dir/io.c.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color "--switch=$(COLOR)" --green "Compiling C source to assembly CMakeFiles/graphchk.dir/io.c.s"
	cd /Users/mac/Downloads/temp/Trident-WEBGPU/src/plugins/meshlets/metis-5.1.0/repo/build/programs && /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/cc $(C_DEFINES) $(C_INCLUDES) $(C_FLAGS) -S /Users/mac/Downloads/temp/Trident-WEBGPU/src/plugins/meshlets/metis-5.1.0/repo/programs/io.c -o CMakeFiles/graphchk.dir/io.c.s

# Object files for target graphchk
graphchk_OBJECTS = \
"CMakeFiles/graphchk.dir/graphchk.c.o" \
"CMakeFiles/graphchk.dir/io.c.o"

# External object files for target graphchk
graphchk_EXTERNAL_OBJECTS =

programs/graphchk: programs/CMakeFiles/graphchk.dir/graphchk.c.o
programs/graphchk: programs/CMakeFiles/graphchk.dir/io.c.o
programs/graphchk: programs/CMakeFiles/graphchk.dir/build.make
programs/graphchk: libmetis/libmetis.a
programs/graphchk: programs/CMakeFiles/graphchk.dir/link.txt
	@$(CMAKE_COMMAND) -E cmake_echo_color "--switch=$(COLOR)" --green --bold --progress-dir=/Users/mac/Downloads/temp/Trident-WEBGPU/src/plugins/meshlets/metis-5.1.0/repo/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_3) "Linking C executable graphchk"
	cd /Users/mac/Downloads/temp/Trident-WEBGPU/src/plugins/meshlets/metis-5.1.0/repo/build/programs && $(CMAKE_COMMAND) -E cmake_link_script CMakeFiles/graphchk.dir/link.txt --verbose=$(VERBOSE)

# Rule to build all files generated by this target.
programs/CMakeFiles/graphchk.dir/build: programs/graphchk
.PHONY : programs/CMakeFiles/graphchk.dir/build

programs/CMakeFiles/graphchk.dir/clean:
	cd /Users/mac/Downloads/temp/Trident-WEBGPU/src/plugins/meshlets/metis-5.1.0/repo/build/programs && $(CMAKE_COMMAND) -P CMakeFiles/graphchk.dir/cmake_clean.cmake
.PHONY : programs/CMakeFiles/graphchk.dir/clean

programs/CMakeFiles/graphchk.dir/depend:
	cd /Users/mac/Downloads/temp/Trident-WEBGPU/src/plugins/meshlets/metis-5.1.0/repo/build && $(CMAKE_COMMAND) -E cmake_depends "Unix Makefiles" /Users/mac/Downloads/temp/Trident-WEBGPU/src/plugins/meshlets/metis-5.1.0/repo /Users/mac/Downloads/temp/Trident-WEBGPU/src/plugins/meshlets/metis-5.1.0/repo/programs /Users/mac/Downloads/temp/Trident-WEBGPU/src/plugins/meshlets/metis-5.1.0/repo/build /Users/mac/Downloads/temp/Trident-WEBGPU/src/plugins/meshlets/metis-5.1.0/repo/build/programs /Users/mac/Downloads/temp/Trident-WEBGPU/src/plugins/meshlets/metis-5.1.0/repo/build/programs/CMakeFiles/graphchk.dir/DependInfo.cmake "--color=$(COLOR)"
.PHONY : programs/CMakeFiles/graphchk.dir/depend

