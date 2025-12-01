/*
===============================================================
                PLC_DISPLAY_SIZEVAR PLUGIN DOCUMENTATION
===============================================================

PURPOSE:
This plugin displays point-light cloth (PLC) stimuli with dynamic size variation.
It renders animated cloth figures using dot positions from pre-calculated motion data,
with size variation modes and ISI (Inter-Stimulus Interval) control.

KEY FEATURES:
- Grid-based dot selection for downsampling
- Noise dot scrambling and positioning
- Displays animated point-light cloth figures with size variation
- Two size variation modes: frame-by-frame random scaling and smooth interpolation
- ISI control with slowdown/no-slowdown options
- Reverse playback 


===============================================================
                        TABLE OF CONTENTS
===============================================================

1. PLUGIN DEFINITION & PARAMETERS
   1.1 Plugin Info Structure
   1.2 Parameter Definitions (Complete List)

2. TRIAL FUNCTION OVERVIEW
   2.1 Canvas Setup & Initialization
   2.2 Variable Declarations
   2.3 Data Import & Processing

3. DOT SELECTION & GRID SYSTEM
   3.1 Grid-based Dot Selection Algorithm
   3.2 Cloth Center Calculation
   3.3 Dot Positioning Logic

4. SIZE VARIATION SYSTEM
   4.1 Size Variation Modes
   4.2 Frame-by-Frame Mode
   4.3 Interpolated Mode
   4.4 Size Factor Calculations

5. ISI (INTER-STIMULUS INTERVAL) SYSTEM
   5.1 ISI Parameter Handling
   5.2 Duration Calculations
   5.3 Animation Loop Integration

6. ANIMATION & DISPLAY 
   6.1 Animation Loop Structure
   6.2 Frame Index Calculations
   6.3 Blank Frame Handling
   6.4 Dot Rendering

7. DATA COLLECTION & OUTPUT
   7.1 Trial Data Structure
   7.2 Performance Metrics
   7.3 Size Tracking Variables

8. UTILITY FUNCTIONS
   8.1 Coordinate Scaling
   8.2 Cloth Center Calculation
   8.3 Random Number Generation
   8.4 Speed Calculations

===============================================================
                    DETAILED PARAMETER REFERENCE
===============================================================

CLOTH MODE PARAMETERS:
- static: Show single frame instead of animation
- random_frame: Specific frame number for static display
- scrambled: Enable dot position scrambling (true or false)
- constantShape: Maintain global shape during scrambling

IF STIFFNESS IS PRESENT:
- stiffnessLevel: Cloth stiffness level (pre-determined based on the display cloth data)
- speedRate: Speed adjustment factor (pre-determined based on the display cloth data)
- equalizeSpeed: Apply speed equalization across in case multiple levels of stiffness present(true or false)

NOISE PARAMETERS:
- noise_num: Number of noise dots
- noise_buffer: Area around cloth for noise placement (in terms of dot radius)

DISPLAY PARAMETERS:
- flipped: Horizontal flip (true or false)
- inverted: Vertical flip (true or false)
- scaling: Initial scale of the cloth
- fps: Frames per second for animation
- trial_duration: Maximum trial duration in seconds
- gridX/gridY: Number of rows and columns for dot selection
- grid_offSet: Randomness when choosing dots for grid positioning (0 is the center of the given grid)
- centerCloth: Move cloth to screen center (true or false)

SIZE VARIATION PARAMETERS:
- sizeVariation: Enable/disable size variation (boolean)
- sizeVariationMode: "frameByFrame" or "interpolated"
- sizeChangingScalingFactor: Target scaling factor (e.g., 1.75)
- interpolationFrameCount: Frames for smooth interpolation (default: 100)
- minSizeFactor/maxSizeFactor: Scaling boundaries
- keepScalingDirection: When true, hold scaling direction for N steps
- scalingDirectionSteps: Number of consecutive steps to keep direction

ISI PARAMETERS:
- isi: Inter-stimulus interval in milliseconds
- isiSlows: Whether ISI extends total duration (boolean)
- isiMode: "blank" (show blank screen during ISI) or "hold" (hold current frame during ISI)


===============================================================
                    VARIABLE REFERENCE GUIDE
===============================================================

CANVAS & DISPLAY VARIABLES:
- canvas: HTML5 canvas element
- context: 2D rendering context
- screenCenter: [width/2, height/2] for coordinate scaling
- w, h: Screen width and height
- radius: Dot radius for rendering

DATA ARRAYS:
- dot_pos: Original imported dot position data
- dot_posX/dot_posY: Processed X/Y coordinates for each dot
- id: Dot ID numbers
- frame: Frame numbers
- allX/allY: All dot positions for size calculations

SELECTION VARIABLES:
- selectedDotIDs: Indices of selected dots for display
- selected_dot_posX/selected_dot_posY: Position arrays for selected dots
- binX_num/binY_num: Grid dimensions
- xbin/ybin: Grid cell sizes
- clothCenter: Center coordinates of cloth

SIZE VARIATION VARIABLES:
- currentSizeFactor: Current scaling factor
- sizeScalingFactor: Target scaling factor
- sizeVariationMode: Current mode ("frameByFrame" or "interpolated")
- interpolationFrameCount: Frames for interpolation
- interpolationStartScale: Starting scale for interpolation
- interpolationTargetScale: Target scale for interpolation
- interpolationProgress: Progress through interpolation (0-1)
- interpolationFramesRemaining: Frames left in current interpolation
- minSizeFactor/maxSizeFactor: Size boundaries

ISI VARIABLES:
- isi: ISI delay in milliseconds
- isiSlows: Whether ISI extends duration
- lastFrameTime: Time of last displayed frame
- isShowingBlankFrame: Currently showing blank frame
- blankFrameStartTime: When blank frame started

ANIMATION VARIABLES:
- start_time: Trial start time
- time_elapsed: Elapsed time in seconds
- percent_time: Progress through trial (0-1)
- frameIndex: Current frame being displayed
- shown_frameNum: Number of frames actually shown
- current_time: Current timestamp

NOISE VARIABLES:
- noiseX/noiseY: Position arrays for noise dots
- random_X/random_Y: Temporally jittered noise positions
- noise_number: Number of noise dots
- spatialBuffer: Buffer area for noise placement

DATA COLLECTION VARIABLES:
- shown_pos_frameX/Y: Recorded positions for speed calculation
- shown_pos_frameTime: Timestamps for each frame
- clothSize_byFrame: Size measurements per frame
- noiseArea_byFrame: Noise area measurements per frame
- overall_cloth_speed: Calculated cloth speed
- overall_noise_speed: Calculated noise speed

===============================================================
                    FUNCTION REFERENCE GUIDE
===============================================================

CORE FUNCTIONS:

move_disc():
- Main animation loop function
- Handles frame timing, ISI, and rendering
- Updates size variation and dot positions
- Manages trial duration and ending

end_trial():
- Finalizes trial data collection
- Calculates performance metrics
- Saves all trial data
- Cleans up display and moves to next trial

UTILITY FUNCTIONS:

scaleCoordinates(objX, objY, z, scaleFactor):
- Converts 3D coordinates to 2D screen coordinates
- Applies scaling and centers on screen
- Returns: {x, y} screen coordinates

calculateClothCenter(allX, allY):
- Calculates center point of cloth from dot positions
- Returns: [centerX, centerY] array

drawDots(x, y):
- Renders individual dots on canvas
- Uses white color with stroke outline

makeNewPosition(horz_min, horz_max, vertical_max, vert_min):
- Generates random position within bounds
- Returns: [x, y] random coordinates

calculate_speed(thisX, thisY, calculateSpeed):
- Calculates speed metrics for dot arrays
- Computes individual and average speeds
- Returns: {mean_speed, ind_speed, overallSpeed}

slowDownMotion(dp, numInterpolatedPoints):
- Adds interpolated frames to slow motion
- Used for speed adjustment
- Returns: Array with interpolated values

HELPER FUNCTIONS:

getRandomInRange(min, max):
- Generates random number in range
- Returns: Random float between min and max

getRandomNumber(min, max):
- Generates random integer in range
- Returns: Random integer between min and max (inclusive)

findCommonElement(array1, array2):
- Checks if arrays have common elements
- Returns: Boolean

calculateFinalSpeed(xSpeed, ySpeed):
- Calculates magnitude from X/Y speeds
- Returns: Euclidean distance

===============================================================
                    SIZE VARIATION MODES EXPLAINED
===============================================================

MODE 1: FRAME-BY-FRAME RANDOM SCALING
- Changes scaling direction randomly at specified intervals
- Uses sizeChangingDirectionTrialNum to control change frequency
- Applies sizeScalingFactor as multiplier each frame
- Works with ISI delays between direction changes
- Creates jerky, random size changes

MODE 2: INTERPOLATED SMOOTH SCALING
- Smoothly interpolates between current and target scales over interpolationFrameCount frames
- Randomly chooses scaling direction (up/down) when interpolation completes
- Applies sizeScalingFactor as multiplier/divisor (e.g., 1.75x up or 1/1.75x down)
- Creates smooth, gradual size changes with random direction changes
- Cycles: scale smoothly → reach target → choose new direction → scale smoothly again

BOUNDARY HANDLING:
- Both modes respect minSizeFactor and maxSizeFactor limits
- When boundaries are hit, target is clamped to boundary
- Ensures size stays within specified range

===============================================================
                    ISI SYSTEM EXPLAINED
===============================================================

ISI (Inter-Stimulus Interval) adds delays between animation frames:

SLOW MODE (isiSlows = true):
- ISI extends total trial duration
- Creates slower, more deliberate animation
- Delays are inserted between animation frames
- Total time = original time + ISI time

FAST MODE (isiSlows = false):
- ISI reduces frame count but maintains duration
- Creates faster animation by skipping frames
- Delays replace some animation frames
- Total time = original time (frames are skipped)

ISI DISPLAY MODES:

BLANK MODE (isiMode = "blank"):
- Shows blank screen during ISI delay
- Creates visual breaks between frames
- Traditional ISI implementation

HOLD MODE (isiMode = "hold"):
- Holds current frame during ISI delay
- Shows same frame for ISI duration, then moves to next frame
- Creates frame persistence effect
- Frame timing still respects isiSlows parameter

IMPLEMENTATION:
- lastFrameTime tracks when last frame was displayed
- isShowingBlankFrame controls ISI delay display
- blankFrameStartTime tracks ISI delay duration
- Frame display is conditional on ISI timing and mode

===============================================================
                    DATA COLLECTION SYSTEM
===============================================================

PERFORMANCE METRICS:
- participant_refreshRate: Actual FPS achieved
- trial_duration: Actual trial duration
- frame_num: Total frames in animation
- shown_frameNum: Frames actually displayed

SIZE TRACKING:
- clothSize_byFrame: Width/height measurements per frame
- noiseArea_byFrame: Noise dot area measurements
- initialClothSize: Starting cloth size
- finalSizeFactor: Final scaling factor

SPEED CALCULATIONS:
- clothSpeed_avr_pxFrame: Average cloth speed
- noiseSpeed_avr_pxFrame: Average noise speed
- Individual dot speeds and directions
- Mean speed components (X/Y)

POSITION TRACKING:
- shown_pos_frameX/Y: All displayed positions
- cloth_overallPos_min/max: Position boundaries
- noise_overallPos_min/max: Noise boundaries

TRIAL DATA OUTPUT:
- All parameters used in trial
- Performance metrics
- Size and speed data
- Timing information
- Screen dimensions

===============================================================
                    USAGE EXAMPLES
===============================================================

BASIC USAGE:
```javascript
var trial = {
    type: 'plc_display_sizeVar',
    dot_pos: clothData,
    sizeVariation: true,
    sizeVariationMode: 'frameByFrame',
    sizeChangingScalingFactor: 1.75,
    isi: 16,
    isiSlows: true,
    isiMode: 'blank'
}
```

INTERPOLATED MODE WITH HOLD ISI:
```javascript
var trial = {
    type: 'plc_display_sizeVar',
    dot_pos: clothData,
    sizeVariation: true,
    sizeVariationMode: 'interpolated',
    sizeChangingScalingFactor: 1.75,
    interpolationFrameCount: 100,
    isi: 100,
    isiSlows: false,
    isiMode: 'hold'
}
```

STATIC DISPLAY:
```javascript
var trial = {
    type: 'plc_display_sizeVar',
    dot_pos: clothData,
    static: true,
    random_frame: 50,
    sizeVariation: false
}
```

===============================================================
                        PLUGIN
===============================================================
*/

jsPsych.plugins["plc_display_sizeVar"] = (function () {
    var plugin = {};
    plugin.info = {
        name: "plc_display_sizeVar  ",
        parameters: {
            static: {
                type: jsPsych.plugins.parameterType.BOOL,
                pretty_name: 'static',
                default: false,
                description: 'the display plays or static?'
            },
            grid_offSet: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'how do we choose dots (in a grid-manner)',
                default: 0,
                description: 'how random the dots will be over grids?'
            },
            noise_num: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'noise_num',
                default: 0,
                description: 'number of noise dots?'
            },
            noise_buffer: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'noise_buffer',
                default: 0,
                description: 'area of the noise dots'
            },
            constantShape: {
                type: jsPsych.plugins.parameterType.BOOL,
                pretty_name: 'constantShape',
                default: false,
                description: 'do we keep the global shape as square while scrambling?'
            },
            random_frame: {
                type: jsPsych.plugins.parameterType.BOOL,
                pretty_name: 'random_frame',
                default: 0,
                description: 'if static, which frame is presented?'
            },
            sizeVariation: {
                type: jsPsych.plugins.parameterType.BOOL,
                pretty_name: 'sizeVariation',
                default: false,
                description: 'whether to apply random size variation like in the walker paper?'
            },
            sizeVariationMode: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'sizeVariationMode',
                default: 'frameByFrame',
                description: 'size variation mode: "frameByFrame" (random direction each frame) or "interpolated" (smooth scaling over frames)'
            },
            interpolationFrameCount: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'interpolationFrameCount',
                default: 100,
                description: 'number of frames over which to smoothly interpolate each size change cycle (only used in interpolated mode). After this many frames, randomly chooses new scaling direction.'
            },
            reversePlayback: {
                type: jsPsych.plugins.parameterType.BOOL,
                pretty_name: 'reversePlayback',
                default: false,
                description: 'when true, plays animation from end to beginning instead of beginning to end'
            },
            frameDur: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'frameDur',
                default: 100,
                description: 'duration of each frame in milliseconds'
            },
            isi: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'ISI',
                default: 0,
                description: 'inter-stimulus interval between consecutive frames in milliseconds (0 = no delay). When > 0, blank frames are inserted between animation frames.'
            },
            isiSlows: {
                type: jsPsych.plugins.parameterType.BOOL,
                pretty_name: 'ISI Slows',
                default: true,
                description: 'If true, ISI extends total duration (slower cloth). If false, ISI reduces frame count but keeps same duration (faster cloth).'
            },
            isiMode: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'ISI Mode',
                default: 'blank',
                description: 'ISI display mode: "blank" (show blank screen during ISI) or "hold" (hold current frame during ISI)'
            },
            pixelsPerDegree: {
                type: jsPsych.plugins.parameterType.FLOAT,
                pretty_name: 'Pixels Per Degree',
                default: 1.75,
                description: 'Conversion factor from pixels to visual angle degrees (adjust for viewing distance and screen DPI)'
            },
            keepScalingDirection: {
                type: jsPsych.plugins.parameterType.BOOL,
                pretty_name: 'Keep Scaling Direction',
                default: false,
                description: 'If true, maintain the same scaling direction for a fixed number of steps unless bounds are hit'
            },
            scalingDirectionSteps: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Scaling Direction Steps',
                default: 1,
                description: 'Number of consecutive scaling steps to keep the direction when keepScalingDirection is true'
            },
        }
    }

    plugin.trial = function (display_element, trial) {
        /*
        ============================
        DEFINING CANVAS & VARIABLES
        ============================
        */

        trial_startTime = performance.now();

        var html = '<canvas id="myCanvas"></canvas>';
        display_element.innerHTML = html;
        var canvas = document.getElementById('myCanvas');
        var context = canvas.getContext("2d");
        //The coordinate for the center of the screen
        var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        var screenCenter = [w / 2, h / 2];
        // Set canvas dimensions
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        document.body.scrollTop = 0; // <-- pull the page back up to the top
        document.body.style.overflow = 'hidden'; // <-- relevant addition
        document.body.style.cursor = 'none'; // <-- hide the cursor

        /*
        ============================
        IMPORT DOT POSITIONS
        ============================
        */

        //stimulus properties  
        var radius = h / 400;
        dot_pos = trial.dot_pos;
        dot_posX = [];
        dot_posY = [];
        id = [];
        frame = [];
        allX = [];
        allY = [];

        var scaleFactor = trial.scaling; // Adjust this scaling factor to control the reduction in area
        if (trial.cycleNum != undefined) {
            cycleNum = trial.cycleNum;
        } else {
            cycleNum = 1;
        }


        for (i = 0; i < dot_pos.length; i++) {
            id.push(dot_pos[i].id);
            frame.push(dot_pos[i].frame);

            // Scale the coordinates using the modified scaleCoordinates function
            var scaledCoords = scaleCoordinates(dot_pos[i].X, dot_pos[i].Y, scaleFactor);

            dot_pos[i].X = scaledCoords.x;
            dot_pos[i].Y = scaledCoords.y;
        }

        cutFrame = trial.cutFrame || 0; // to cut the first N frames if needed
        //frame number & dot number
        frame_num = ([...new Set(frame)].length);
        dot_num = [...new Set(id)].length;


        t = 0;
        for (f = 0; f < frame_num; f++) {
            m = 0;
            for (ii = 0; ii < dot_num; ii++) {
                if (!dot_posX[m]) {
                    dot_posX[m] = [];
                    dot_posY[m] = [];
                }
                dot_posX[m].push(dot_pos[t].X);
                dot_posY[m].push(dot_pos[t].Y)
                m++

                if (f == 0) {
                    allX.push(parseFloat(dot_pos[t].X)); // this is to determine the surface area of the object
                    allY.push(parseFloat(dot_pos[t].Y));
                }
                t++
            }
        }



        fps = trial.fps;
        frame_num = (frame_num - cutFrame) * cycleNum; // to repeat the animation cycle

        if (trial.trial_duration == undefined) {
            trial_duration = (frame_num / fps);
        } else {
            trial_duration = trial.trial_duration;
            frame_num = trial_duration * fps;
        }

        /*
        ============================
        GETTING THE IMP. DOTS 
        ============================
        */
        //if canvas moves due to a reason such as fullscreening, adjust the cloth position to be at the center again
        // Calculate the bin size for both dimensions
        clothCenter = calculateClothCenter(allX, allY);
        // Calculate the center of the cloth
        var clothCenterX = clothCenter[0];
        var clothCenterY = clothCenter[1];

        // Arrays to store the IDs of equally spaced dots
        selectedDotIDs = [];
        selected_dot_posX = [];
        selected_dot_posY = [];

        // Adjust this value to control the selected dot's distance range from the bin center (to add noise)
        var offsetFactor = trial.grid_offSet;

        // Calculate the number of dots needed per bin to maintain the same total number of selected dots
        var binX_num = trial.gridX; // Number of bins horizontally
        var binY_num = trial.gridY;  // Number of bins vertically

        // Calculate the number of dots needed to maintain the same total number of selected dots
        let dotsNeeded = binX_num * binY_num;
        // Calculate the number of dots to select per bin
        const dotsPerBin = 1;
        let totalSelected = 0;

        // Calculate the dimensions of each grid cell
        var xbin = clothWidth / (binX_num);
        var ybin = clothHeight / (binY_num);

        // Replace this block with the corrected version
        for (let x = 0; x < binX_num; x++) {
            for (let y = 0; y < binY_num; y++) {
                let offsetX, offsetY;

                offsetX = minX + ((x) + (offsetFactor * (Math.random() - 0.5)) + 0.5) * xbin;
                offsetY = minY + ((y) + (offsetFactor * (Math.random() - 0.5)) + 0.5) * ybin;

                // Find the closest dots to the random position within the bin
                const closestDotIDs = [];
                for (let dotID = 0; dotID < dot_posX.length; dotID++) {
                    const distance = Math.sqrt((dot_posX[dotID][0] - offsetX) ** 2 + (dot_posY[dotID][0] - offsetY) ** 2);
                    closestDotIDs.push({ id: dotID, distance: distance });
                }

                // Sort closest dots by distance
                closestDotIDs.sort((a, b) => a.distance - b.distance);

                // Add closest dots to selected dots until reaching the required number
                let added = 0;
                for (const dist of closestDotIDs) {
                    // Check if the dot has already been selected
                    if (selectedDotIDs.includes(dist.id)) {
                        continue; // Skip this dot and move to the next one
                    }

                    // Check if the required number of dots per bin has been reached
                    if (added >= dotsPerBin || totalSelected >= dotsNeeded) {
                        break; // Exit the loop if the requirements are met
                    }

                    // Add the current dot to the selected dots
                    selected_dot_posX[totalSelected] = dot_posX[dist.id];
                    selected_dot_posY[totalSelected] = dot_posY[dist.id];
                    selectedDotIDs.push(dist.id);
                    added++;
                    totalSelected++;

                }
            }
        }


        /*
        ============================
        MOVE CLOTH TO THE CENTER
        ============================
        */
        allX = [];
        allY = [];
        //Calculate the displacement needed to move the cloth to the center of the screen
        if (trial.centerCloth == true) {
            var deltaX = parseFloat(screenCenter[0]) - parseFloat(clothCenterX);
            var deltaY = parseFloat(screenCenter[1]) - parseFloat(clothCenterY);

            // Move the cloth to the center of the screen
            for (var i = 0; i < selected_dot_posX.length; i++) {
                for (var j = 0; j < selected_dot_posX[i].length; j++) {
                    selected_dot_posX[i][j] += deltaX;
                    selected_dot_posY[i][j] += deltaY;
                    if (j == 0) {
                        allX.push(parseFloat(selected_dot_posX[i][j]));
                        allY.push(parseFloat(selected_dot_posY[i][j]));
                    }

                }
            }
            // cloth center again after moving
            clothCenter = calculateClothCenter(allX, allY);
            var clothCenterX = clothCenter[0];
            var clothCenterY = clothCenter[1];
        }

        for (i = 0; i < selected_dot_posX.length; i++) {
            selected_dot_posX[i].splice(0, cutFrame);
            selected_dot_posY[i].splice(0, cutFrame);
        }

        for (c = 0; c < cycleNum; c++) {
            for (i = 0; i < selected_dot_posX.length; i++) {
                selected_dot_posX[i] = selected_dot_posX[i].concat(selected_dot_posX[i]);
                selected_dot_posY[i] = selected_dot_posY[i].concat(selected_dot_posY[i]);
            }
        }



        //********************************//
        //  ISI ADJUSTMENT FOR DURATION   //
        //********************************//
        // Adjust trial duration based on ISI and isiSlows parameter
        if (trial.isi > 0) {
            if (trial.isiSlows === true) {
                // If ISI slows down the animation, extend the trial duration
                oneCycleIsi = (frame_num - 1) * (trial.isi / 1000); // Total ISI time in seconds
                trial_duration += oneCycleIsi;
            }
            // Note: If isiSlows is false, ISI reduces frame count but keeps same duration (faster cloth)
            // This is handled in the animation loop by skipping frames
        }


        //********************************//
        //  SIZE VARIATION SETUP (ABSOLUTE)
        //********************************//

        // --- Step 1: Measure initial cloth size in pixels ---
        let initialClothWidth = Math.max(...allX) - Math.min(...allX);
        let initialClothHeight = Math.max(...allY) - Math.min(...allY);
        let initialClothSizePx = Math.sqrt(initialClothWidth ** 2 + initialClothHeight ** 2); // diagonal = perceptual extent

        // --- Step 2: Convert to degrees based on screen geometry ---
        let pixelsPerDegree = trial.pixelsPerDegree || 50;  // ≈ depends on viewing setup

        // --- Step 3: Define absolute size limits (in degrees, *fixed from paper*) ---
        const minAbsDeg = trial.minSizeFactor || 1.6;
        const maxAbsDeg = trial.maxSizeFactor || 7.3;

        // --- Step 4: Compute absolute min/max in pixels ---
        const minAbsPx = minAbsDeg * pixelsPerDegree;
        const maxAbsPx = maxAbsDeg * pixelsPerDegree;

        // --- Step 5: Derive scaling factors *relative to the initial size*, 
        // ensuring the same absolute bounds for any starting cloth
        const minScale = minAbsPx / initialClothSizePx;
        const maxScale = maxAbsPx / initialClothSizePx;


        // --- Step 6: Log-scale setup for perceptually balanced changes ---
        const logStepBase = Math.log(trial.sizeChangingScalingFactor || 1.75);
        const logMin = Math.log(minScale);
        const logMax = Math.log(maxScale);


        // Start at a random scale within absolute limits
        let logScale = Math.random() * (logMax - logMin) + logMin;
        let currentSizeFactor = Math.exp(logScale);

        // --- Step 7: Direction control ---
        let directionSign = Math.random() < 0.5 ? 1 : -1;

        // --- Step 8: Update function (absolute bounds, not relative) ---
        function updateSizeFactor() {

            directionSign = Math.random() < 0.5 ? 1 : -1;

            tempScale = logScale + (directionSign * logStepBase);

            // Absolute boundary handling (clamp + reverse)
            if (tempScale > logMax || tempScale < logMin) {
                directionSign *= -1;
                logScale += directionSign * logStepBase;
            } else {
                logScale += directionSign * logStepBase;
            }

            currentSizeFactor = Math.exp(logScale);
        }

        // --- Step 9: Convert to pixel-space scale on every draw ---
        function getPixelScale() {
            return currentSizeFactor; // already in pixel-space ratio relative to base cloth
        }



        //**************************//
        //         DRAWING          //
        //**************************//
        shownDotsId = [];
        shown = [];


        total_neededDot = binX_num * binY_num;
        // Create an array of indices corresponding to dot positions
        dotIndices = Array.from({ length: dot_posX.length }, (_, i) => i);
        // Shuffle the array of indices
        selectedDotIDs = [];
        shuffledIndices = shuffle(dotIndices);
        // Select the first n indices from the shuffled array
        selectedDotIDs = shuffledIndices.slice(0, total_neededDot);
        // Convert selected indices to dot IDs and add them to selectedDotIDs array

        if (trial.static == true) {
            if (trial.random_frame == undefined) {
                random_frame = getRandomInt(dot_posX[0].length);

            } else {
                random_frame = trial.random_frame;
            }
        }

        shown_pos_frameX = [];
        shown_pos_frameY = [];
        shown_pos_frameTime = [];
        clothSize_byFrame = {
            width: [],
            height: [],
        }

        flipped = false;
        if (trial.flipped == true) {
            // Save the current state of the context
            context.save();
            // Translate to the center of the canvas
            context.translate(canvas.width / 2, canvas.height / 2);

            if (trial.flipped == true) {
                // Scale by -1 in both x and y directions to flip and invert
                context.scale(-1, -1);
                flipped = true;
            } else {
                // Scale by -1 in the x direction to flip  
                context.scale(-1, 1);
                flipped = true;
            }
            // Translate back to the original position
            context.translate(-canvas.width / 2, -canvas.height / 2);
        }

        shown_frameNum = 0;

        start_time = performance.now();
        time_elapsed = 0;
        lastFrameTime = 0; // Track when the last frame was displayed for ISI
        isShowingBlankFrame = false; // Track if we're currently showing a blank frame
        lastDisplayedFrameIndex = -1; // Track the last frame we actually displayed
        blankFrameStartTime = 0; // Track when the blank frame started
        isiMode = trial.isiMode || 'blank'; // ISI display mode: 'blank' or 'hold'
        hasShownVisibleTickForThisFrame = false; // For blank mode: render visible exactly once per frame

        // Arrays for CSV tracking (frame-by-frame data)
        csv_frameData = {
            clothWidth: [],
            clothHeight: [],
            scalingFactor: [],
            isi: [],
            isiSlows: [],
            displayFrameNumber: [],
            timeElapsed: [],
            timeInCurrentDisplayFrame: [],
            isiMode: []
        };

        currentDisplayFrameStartTime = 0;
        previousDisplayFrameNumber = -1;

        // Draw the rectangle      
        frameCounter = 0;
        let cycleVisibleFrames = 0;
        let cycleBlankFrames = 0;
        let currentScalingDirection = 0; // Persist scaling direction across frames
        // Persistent scaling-direction control


        move_disc();
        function move_disc() {
            current_time = performance.now();
            time_elapsed = parseFloat(current_time - start_time) / 1000;

            // Initialize first display frame
            if (lastDisplayedFrameIndex === -1) {
                lastDisplayedFrameIndex = 0;
                currentDisplayFrameStartTime = current_time;
            }

            percent_time = time_elapsed / parseFloat(trial_duration);
            context.clearRect(0, 0, canvas.width, canvas.height); //deleting

            frameCounter++;

            // Track time elapsed in current display frame
            const timeInCurrentFrameMs = current_time - currentDisplayFrameStartTime;
            let timeInCurrentFrame = timeInCurrentFrameMs / 1000;

            if (trial.trial_duration && time_elapsed >= trial.trial_duration) {
                // If trial duration is defined and time elapsed exceeds it, end the trial
                interval = window.setInterval(end_trial);
                return; // Exit the function
            }

            if (time_elapsed < (trial_duration)) {

                // Calculate frame index first
                let frameIndex;
                if (trial.reversePlayback == true) {
                    // Play from end to beginning
                    frameIndex = frame_num - 1 - parseInt(percent_time * frame_num);
                } else {
                    // Play from beginning to end (normal)
                    frameIndex = parseInt(percent_time * frame_num);
                }

                // Clamp frame index to valid range
                frameIndex = Math.max(0, Math.min(frameIndex, frame_num - 1));

                // ISI/hold Logic: Control phase and when to advance to next frame
                let shouldAdvanceFrame = false;
                const frameDurMs = trial.frameDur || 0;
                const isiMs = trial.isi || 0;

                if (isiMode === 'hold') {
                    // Show the same frame for frameDur; advance afterwards
                    if (timeInCurrentFrameMs >= frameDurMs) {
                        shouldAdvanceFrame = true;
                        currentDisplayFrameStartTime = current_time;
                    }
                } else { // blank mode
                    // Show the frame exactly once, then blank for isi, then advance
                    if (!hasShownVisibleTickForThisFrame) {
                        // visible tick will be drawn below; start blank timing then
                        // do not advance yet
                    } else {
                        if (isiMs === 0 || (current_time - blankFrameStartTime) >= isiMs) {
                            shouldAdvanceFrame = true;
                            hasShownVisibleTickForThisFrame = false;
                            currentDisplayFrameStartTime = current_time;
                        }
                    }
                }

                // Only advance frame index when allowed
                if (shouldAdvanceFrame) {
                    // Choose next frame based on percent_time mapping
                    let nextIndex;
                    if (trial.reversePlayback == true) {
                        nextIndex = frame_num - 1 - parseInt(percent_time * frame_num);
                    } else {
                        nextIndex = parseInt(percent_time * frame_num);
                    }
                    nextIndex = Math.max(0, Math.min(nextIndex, frame_num - 1));

                    const previousIndex = lastDisplayedFrameIndex;
                    lastDisplayedFrameIndex = nextIndex;

                    // Apply size scaling step only when the presented frame changes
                    if (trial.sizeVariation == true && lastDisplayedFrameIndex !== previousIndex) {
                        updateSizeFactor();
                    }

                    hasShownVisibleTickForThisFrame = false;
                }

                // Show animation content based on ISI mode
                if (isiMode === 'hold') {
                    // Show the current frame (use lastDisplayedFrameIndex for consistency)
                    let displayFrameIndex = lastDisplayedFrameIndex;

                    // Start new cycle if this is the first visible frame after blank
                    if (cycleBlankFrames > 0) {
                        cycleVisibleFrames = 0;
                        cycleBlankFrames = 0;
                        cycleStartTime = current_time;
                    }

                    if (cycleVisibleFrames === 0) {
                        cycleStartTime = current_time;
                        visibleStartTime = current_time;
                    }

                    cycleVisibleFrames++;

                    inFrame_x = [];
                    inFrame_y = [];

                    // Use current size factor without updating during the held frame
                    let scale = trial.sizeVariation === true ? getPixelScale() : 1;

                    for (i = 0; i < selectedDotIDs.length; i++) {
                        if (trial.static == false) {
                            let origX = selected_dot_posX[i][displayFrameIndex];
                            let origY = selected_dot_posY[i][displayFrameIndex];


                            // Use the fixed center for scaling to prevent center movement
                            get_posX = clothCenterX + (origX - clothCenterX) * scale;
                            get_posY = clothCenterY + (origY - clothCenterY) * scale;

                        } else {
                            get_posX = selected_dot_posX[i][parseInt(random_frame)];
                            get_posY = selected_dot_posY[i][parseInt(random_frame)];
                        }

                        inFrame_x.push(get_posX);
                        inFrame_y.push(get_posY);
                        drawDots(get_posX, get_posY)

                        if (!shown_pos_frameX[i]) {
                            shown_pos_frameX[i] = [];
                            shown_pos_frameY[i] = [];
                            shown_pos_frameTime[i] = [];
                        }
                        shown_pos_frameX[i].push(get_posX);
                        shown_pos_frameY[i].push(get_posY);
                        shown_pos_frameTime[i].push(current_time);
                    }

                    //save cloth size in each frame
                    let currentClothWidth = Math.max(...inFrame_x) - Math.min(...inFrame_x);
                    let currentClothHeight = Math.max(...inFrame_y) - Math.min(...inFrame_y);
                    clothSize_byFrame.width.push(currentClothWidth);
                    clothSize_byFrame.height.push(currentClothHeight);

                    // Track CSV data for visible frames
                    csv_frameData.clothWidth.push(currentClothWidth);
                    csv_frameData.clothHeight.push(currentClothHeight);
                    csv_frameData.scalingFactor.push(currentScalingDirection || 0);
                    csv_frameData.isi.push(trial.isi || 0);
                    csv_frameData.isiSlows.push(trial.isiSlows !== undefined ? trial.isiSlows : true);
                    csv_frameData.displayFrameNumber.push(lastDisplayedFrameIndex);
                    csv_frameData.timeElapsed.push(time_elapsed);
                    csv_frameData.timeInCurrentDisplayFrame.push(timeInCurrentFrame);
                    csv_frameData.isiMode.push(isiMode);

                    shown_frameNum++
                    lastFrameTime = current_time; // Update the last frame time
                } else if (isiMode === 'blank' && !hasShownVisibleTickForThisFrame) {
                    // Show the current frame exactly once (one RAF), then start blank timing
                    let displayFrameIndex = lastDisplayedFrameIndex;

                    if (cycleBlankFrames > 0) {
                        cycleVisibleFrames = 0;
                        cycleBlankFrames = 0;
                        cycleStartTime = current_time;
                    }

                    if (cycleVisibleFrames === 0) {
                        cycleStartTime = current_time;
                        visibleStartTime = current_time;
                    }

                    cycleVisibleFrames++;

                    inFrame_x = [];
                    inFrame_y = [];

                    // Use current size factor without updating (update happens only on frame change)
                    let scale = trial.sizeVariation == true ? currentSizeFactor : 1;

                    for (i = 0; i < selectedDotIDs.length; i++) {
                        if (trial.static == false) {
                            let origX = selected_dot_posX[i][displayFrameIndex];
                            let origY = selected_dot_posY[i][displayFrameIndex];

                            get_posX = clothCenterX + (origX - clothCenterX) * scale;
                            get_posY = clothCenterY + (origY - clothCenterY) * scale;

                        } else {
                            get_posX = selected_dot_posX[i][parseInt(random_frame)];
                            get_posY = selected_dot_posY[i][parseInt(random_frame)];
                        }

                        inFrame_x.push(get_posX);
                        inFrame_y.push(get_posY);
                        drawDots(get_posX, get_posY)

                        if (!shown_pos_frameX[i]) {
                            shown_pos_frameX[i] = [];
                            shown_pos_frameY[i] = [];
                            shown_pos_frameTime[i] = [];
                        }
                        shown_pos_frameX[i].push(get_posX);
                        shown_pos_frameY[i].push(get_posY);
                        shown_pos_frameTime[i].push(current_time);
                    }

                    let currentClothWidth = Math.max(...inFrame_x) - Math.min(...inFrame_x);
                    let currentClothHeight = Math.max(...inFrame_y) - Math.min(...inFrame_y);
                    clothSize_byFrame.width.push(currentClothWidth);
                    clothSize_byFrame.height.push(currentClothHeight);

                    csv_frameData.clothWidth.push(currentClothWidth);
                    csv_frameData.clothHeight.push(currentClothHeight);
                    csv_frameData.scalingFactor.push(currentScalingDirection || 0);
                    csv_frameData.isi.push(trial.isi || 0);
                    csv_frameData.isiSlows.push(trial.isiSlows !== undefined ? trial.isiSlows : true);
                    csv_frameData.displayFrameNumber.push(lastDisplayedFrameIndex);
                    csv_frameData.timeElapsed.push(time_elapsed);
                    csv_frameData.timeInCurrentDisplayFrame.push(timeInCurrentFrame);
                    csv_frameData.isiMode.push(isiMode);

                    shown_frameNum++
                    lastFrameTime = current_time; // Update the last frame time
                    hasShownVisibleTickForThisFrame = true;
                    blankFrameStartTime = current_time;
                } else if (isiMode === 'blank' && hasShownVisibleTickForThisFrame) {
                    // Blank mode: show nothing during ISI delay
                    if (cycleBlankFrames === 0) {
                        blankStartTime = current_time;
                    }

                    cycleBlankFrames++;

                    // Track CSV data for blank frames
                    csv_frameData.clothWidth.push(null);
                    csv_frameData.clothHeight.push(null);
                    csv_frameData.scalingFactor.push(null);
                    csv_frameData.isi.push(trial.isi || 0);
                    csv_frameData.isiSlows.push(trial.isiSlows !== undefined ? trial.isiSlows : true);
                    csv_frameData.displayFrameNumber.push('blank');
                    csv_frameData.timeElapsed.push(time_elapsed);
                    csv_frameData.timeInCurrentDisplayFrame.push(timeInCurrentFrame);
                    csv_frameData.isiMode.push(isiMode);
                }
                requestAnimationFrame(function () { move_disc() })
            }
            else {
                interval = window.setInterval(end_trial);
            }
        };


        //***************************//
        //         CSV FUNCTIONS    //
        //*************************//

        function downloadCSV(csvContent, filename) {
            // Create a blob from the CSV content
            var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

            // Create a link element
            var link = document.createElement("a");
            if (link.download !== undefined) {
                // Create a URL for the blob
                var url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", filename);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }

        function generateFrameByFrameCSV() {
            // Create CSV header - every actual refresh frame is one row
            let csv = 'clothWidth_px,clothHeight_px,scalingFactor,isi_ms,isiSlows,displayFrameNumber,timeElapsed_s,timeInCurrentDisplayFrame_s,isiMode\n';

            // Add data rows
            for (let i = 0; i < csv_frameData.clothWidth.length; i++) {
                csv += (csv_frameData.clothWidth[i] !== null ? csv_frameData.clothWidth[i] : '') + ',';
                csv += (csv_frameData.clothHeight[i] !== null ? csv_frameData.clothHeight[i] : '') + ',';
                csv += (csv_frameData.scalingFactor[i] !== null ? csv_frameData.scalingFactor[i] : '') + ',';
                csv += csv_frameData.isi[i] + ',';
                csv += csv_frameData.isiSlows[i] + ',';
                csv += csv_frameData.displayFrameNumber[i] + ','; // Will be 'blank' for blank ISI frames
                csv += csv_frameData.timeElapsed[i] + ',';
                csv += csv_frameData.timeInCurrentDisplayFrame[i] + ',';
                csv += csv_frameData.isiMode[i] + '\n';
            }

            return csv;
        }


        //***************************//
        //         ENDING           //
        //*************************//

        var end_trial = function () {
            trial_endTime = performance.now();

            participant_refreshRate = shown_frameNum / trial_duration;


            if (trial.limitedTime == false) {
                savingIDs = selectedDotIDs;
            }

            // data saving 
            var trial_data = {
            };

            // Generate and download CSV files
            // File 1: Frame-by-frame data
            let frameCSV = generateFrameByFrameCSV();
            let timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            let clothName = trial.motion || trial.clothType || 'cloth';
            downloadCSV(frameCSV, clothName + '_frameByFrame_' + timestamp + '.csv');


            // clear the display
            display_element.innerHTML = '';

            document.body.style.cursor = 'default'; // <-- show the cursor again

            window.clearInterval(interval)

            // move on to the next trial 
            jsPsych.finishTrial(trial_data);
        };


        //***************************//
        //         FUNCTIONS        //
        //*************************//

        function drawDots(x, y) {
            // Set dot color and radius
            context.fillStyle = 'white';
            context.beginPath();
            context.arc(x, y, radius, 0, 2 * Math.PI);
            context.fill();
            context.lineWidth = '2';
            context.strokeStyle = 'white';
            context.stroke();
        }


        function makeNewPosition(horz_min, horz_max, vertical_max, vert_min) {
            // Get viewport dimensions (remove the dimension of the div)
            var rand_x = (Math.random() * (horz_max - horz_min)) + horz_min;
            var rand_y = (Math.random() * (vertical_max - vert_min)) + vert_min;
            return [rand_x, rand_y];
        }


        function scaleCoordinates(objX, objY, scaleFactor) {
            // Assuming camera is looking towards the negative z-axis
            var scale = scaleFactor;
            var projectedX = objX * scale + screenCenter[0];
            var projectedY = -objY * scale + screenCenter[1];
            return { x: projectedX, y: projectedY };
        }

        function calculateClothCenter(allX, allY) {
            minX = Math.min(...allX);
            minY = Math.min(...allY);
            maxX = Math.max(...allX);
            maxY = Math.max(...allY);
            clothWidth = maxX - minX;
            clothHeight = maxY - minY;
            var clothCenterX = minX + (clothWidth / 2);
            var clothCenterY = minY + (clothHeight / 2);

            return [clothCenterX, clothCenterY];
        }

        function getRandomInRange(min, max) {
            // Generate a random number between min and max
            return Math.random() * (max - min) + min;
        }



        function getRandomNumber(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }


    }


    return plugin;
})()