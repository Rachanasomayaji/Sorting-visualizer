// DOM Elements
let array = [];
const arrayContainer = document.getElementById('arrayContainer');
const randomizeArrayButton = document.getElementById('randomizeArray');
const sortButton = document.getElementById('sort');
const algorithmSelect = document.getElementById('algorithm');
const sizeSlider = document.getElementById('arraySize');
const speedSelect = document.getElementById('speed');

// Generate random array with size input
function createRandomArray(size) {
    array = [];
    for (let i = 0; i < size; i++) {
        array.push(Math.floor(Math.random() * 1000) + 1); // Random value between 1 and 1000
    }
    displayArray();
}

function displayArray() {
    arrayContainer.innerHTML = ''; // Clear existing bars

    const containerWidth = arrayContainer.clientWidth; // Width of the container
    const containerHeight = arrayContainer.clientHeight; // Height of the container
    const numBars = array.length;
    const minBarWidth = 10; // Minimum width of bars
    const maxBarWidth = containerWidth / numBars; // Maximum width based on the number of bars
    const barWidth = Math.max(minBarWidth, maxBarWidth); // Ensure minimum width

    const maxArrayValue = Math.max(...array);

    // Define a margin to avoid the tallest bar touching the ceiling
    const margin = 10;
    const maxBarHeight = containerHeight - margin; // Maximum height for the tallest bar

    array.forEach(value => {
        const bar = document.createElement('div');
        bar.classList.add('bar');
        
        // Create a span for the number
        const number = document.createElement('span');
        number.textContent = value;

        // Scale the bar height based on the maximum value and maximum bar height
        const barHeight = (value / maxArrayValue) * maxBarHeight;
        bar.style.height = `${barHeight}px`;
        bar.style.width = `${barWidth}px`;
        bar.style.backgroundColor = 'blue'; // Set solid color
        
        // Center the number inside the bar
        number.style.lineHeight = `${barHeight}px`; // Center number vertically
        bar.appendChild(number); // Add the number to the bar

        arrayContainer.appendChild(bar);
    });
}

// Get sorting speed based on user selection
function getSpeed() {
    switch (speedSelect.value) {
        case 'fast': return 250;
        case 'medium': return 300;
        default: return 500; // Slow
    }
}

// Delay function for sorting animation
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Bubble Sort Algorithm----------------------------------------------------------------------------
async function bubbleSort() {
    let bars = document.getElementsByClassName('bar');

    // Disable the buttons while sorting
    sortButton.disabled = true;
    randomizeArrayButton.disabled = true;
    
    for (let i = 0; i < array.length - 1; i++) {
        let swapped = false;  // To track if a swap occurred

        for (let j = 0; j < array.length - i - 1; j++) {
            // Set color to red for comparison (stay red until sorted)
            bars[j].style.backgroundColor = 'red';
            bars[j + 1].style.backgroundColor = 'red';

            await sleep(getSpeed()); // Animation delay to visualize comparison

            // Compare and swap if needed
            if (array[j] > array[j + 1]) {
                [array[j], array[j + 1]] = [array[j + 1], array[j]]; // Swap values
                displayArray(); // Update the visual array to reflect the swap
                swapped = true;  // Indicate a swap occurred

                // Keep them red while swapping and moving
                await sleep(getSpeed()); // Additional delay to visualize the swap
            }
        }

        // Fix the last element in its correct position by turning it green
        bars[array.length - i - 1].style.backgroundColor = 'green';

        // If no elements were swapped in this pass, the array is already sorted
        if (!swapped) break;
    }

    // After sorting is complete, ensure all remaining bars are green
    for (let k = 0; k < array.length; k++) {
        bars[k].style.backgroundColor = 'green';
    }

    // Re-enable the buttons after sorting is complete
    sortButton.disabled = false;
    randomizeArrayButton.disabled = false;
}

// Helper function to simulate sleep (delay)
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


// Selection Sort Algorithm----------------------------------------------------------------------------
async function selectionSort() {
    let bars = document.getElementsByClassName('bar');

    // Disable the buttons while sorting
    sortButton.disabled = true;
    randomizeArrayButton.disabled = true;

    for (let i = 0; i < array.length - 1; i++) {
        let minIndex = i;

        // Highlight the current bar as red (bar being checked for minimum)
        bars[minIndex].style.backgroundColor = 'red';

        for (let j = i + 1; j < array.length; j++) {
            // Highlight the bar being compared as yellow
            bars[j].style.backgroundColor = 'yellow';

            await sleep(getSpeed()); // Animation delay

            // Compare and find the new minimum
            if (array[j] < array[minIndex]) {
                // Reset the color of the previous minIndex back to blue
                if (minIndex !== i) {
                    bars[minIndex].style.backgroundColor = 'blue';
                }

                minIndex = j;

                // Highlight the new minimum as red
                bars[minIndex].style.backgroundColor = 'red';
            } else {
                // Reset the compared bar color back to blue if it's not the minimum
                bars[j].style.backgroundColor = 'blue';
            }
        }

        // Swap if the minIndex has changed
        if (minIndex !== i) {
            [array[i], array[minIndex]] = [array[minIndex], array[i]]; // Swap values
            displayArray(); // Update the visual array

            // Highlight the swapped bars
            bars[minIndex].style.backgroundColor = 'blue'; // Reset the old minIndex to blue
            bars[i].style.backgroundColor = 'green'; // The new sorted position turns green
        } else {
            // Mark the current position as sorted (green) if no swap was needed
            bars[i].style.backgroundColor = 'green';
        }

        await sleep(getSpeed()); // Animation delay for the swap
    }

    // Mark the last bar as sorted
    bars[array.length - 1].style.backgroundColor = 'green';

    // Turn all bars green at the end to indicate the entire array is sorted
    for (let k = 0; k < array.length; k++) {
        bars[k].style.backgroundColor = 'green';
    }

    // Re-enable the buttons after sorting is complete
    sortButton.disabled = false;
    randomizeArrayButton.disabled = false;
}

// Helper function to simulate sleep (delay)
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


// Quick Sort Algorithm--------------------------------------------------------------------------------------
async function quickSort(start, end) {
    if (start >= end) return;

    // Disable the buttons while sorting
    sortButton.disabled = true;
    randomizeArrayButton.disabled = true;

    let pivotIndex = await partition(start, end);

    // Recursively sort the subarrays
    await quickSort(start, pivotIndex - 1);
    await quickSort(pivotIndex + 1, end);

    // After the entire array is sorted, turn all bars green
    if (start === 0 && end === array.length - 1) {
        for (let k = 0; k < array.length; k++) {
            let bars = document.getElementsByClassName('bar');
            bars[k].style.backgroundColor = 'green';
        }

        // Re-enable the buttons after sorting is complete
        sortButton.disabled = false;
        randomizeArrayButton.disabled = false;
    }
}

// Partition function for Quick Sort
async function partition(start, end) {
    let bars = document.getElementsByClassName('bar');
    let pivotValue = array[end];
    let pivotIndex = start;

    // Highlight the pivot element in red
    bars[end].style.backgroundColor = 'red';

    for (let i = start; i < end; i++) {
        // Highlight the element being compared in yellow
        bars[i].style.backgroundColor = 'yellow';
        await sleep(getSpeed()); // Animation delay

        if (array[i] < pivotValue) {
            // Swap values and update the bars' position
            [array[i], array[pivotIndex]] = [array[pivotIndex], array[i]];
            displayArray();

            // Reset the bar back to blue after comparison and highlight the pivotIndex
            bars[pivotIndex].style.backgroundColor = 'blue';
            pivotIndex++;

            await sleep(getSpeed()); // Animation delay for swap
        }

        // Reset the compared bar color back to blue if it is not swapped
        bars[i].style.backgroundColor = 'blue';
    }

    // Swap the pivot element to its correct position
    [array[pivotIndex], array[end]] = [array[end], array[pivotIndex]];
    displayArray();

    // Mark the pivot in its correct position as green (sorted)
    bars[pivotIndex].style.backgroundColor = 'green';

    await sleep(getSpeed()); // Animation delay

    return pivotIndex;
}

// Helper function to simulate sleep (delay)
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


// Merge Sort Algorithm--------------------------------------------------------------------------------------
async function mergeSort(left, right) {
    if (left >= right) return;

    // Disable the buttons while sorting
    sortButton.disabled = true;
    randomizeArrayButton.disabled = true;

    const mid = Math.floor((left + right) / 2);

    await mergeSort(left, mid);    // Sort left half
    await mergeSort(mid + 1, right); // Sort right half
    await merge(left, mid, right);  // Merge the sorted halves

    // Turn bars green after the entire array is sorted
    if (left === 0 && right === array.length - 1) {
        for (let i = 0; i < array.length; i++) {
            let bars = document.getElementsByClassName('bar');
            bars[i].style.backgroundColor = 'green';
        }

        // Disable the buttons while sorting
        sortButton.disabled = true;
        randomizeArrayButton.disabled = true;
    }
}

// Merge function for Merge Sort with color updates
async function merge(left, mid, right) {
    let bars = document.getElementsByClassName('bar');
    let leftArray = array.slice(left, mid + 1);
    let rightArray = array.slice(mid + 1, right + 1);
    let i = 0, j = 0, k = left;

    // Highlight the subarray currently being merged
    for (let x = left; x <= right; x++) {
        bars[x].style.backgroundColor = 'yellow';
    }

    await sleep(getSpeed()); // Pause to show the highlight

    // Merge the two arrays into the main array
    while (i < leftArray.length && j < rightArray.length) {
        if (leftArray[i] <= rightArray[j]) {
            array[k] = leftArray[i];
            i++;
        } else {
            array[k] = rightArray[j];
            j++;
        }
        displayArray();

        // Highlight the current position in blue
        bars[k].style.backgroundColor = 'blue';
        k++;
        await sleep(getSpeed());
    }

    // If there are any remaining elements in the leftArray
    while (i < leftArray.length) {
        array[k] = leftArray[i];
        i++;
        k++;
        displayArray();

        // Highlight the current position in blue
        bars[k - 1].style.backgroundColor = 'blue';
        await sleep(getSpeed());
    }

    // If there are any remaining elements in the rightArray
    while (j < rightArray.length) {
        array[k] = rightArray[j];
        j++;
        k++;
        displayArray();

        // Highlight the current position in blue
        bars[k - 1].style.backgroundColor = 'blue';
        await sleep(getSpeed());
    }

    // After the entire merge for this segment is done, turn all merged bars green
    for (let x = left; x <= right; x++) {
        bars[x].style.backgroundColor = 'green';
    }
}

// Helper function to simulate sleep (delay)
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


// Heap Sort Algorithm---------------------------------------------------------------------------------------


// Heapify function for Heap Sort with color updates
async function heapSort() {
    let bars = document.getElementsByClassName('bar');

    // Disable the buttons while sorting
    sortButton.disabled = true;
    randomizeArrayButton.disabled = true;
    
    // Build heap (rearrange array)
    for (let i = Math.floor(array.length / 2) - 1; i >= 0; i--) {
        await heapify(array.length, i);
    }

    // One by one extract elements from heap
    for (let i = array.length - 1; i > 0; i--) {
        // Highlight the root (red) and last element (yellow) to swap
        bars[0].style.backgroundColor = 'red';
        bars[i].style.backgroundColor = 'yellow';

        await sleep(getSpeed()); // Delay to visualize colors

        // Swap the root with the last element
        [array[0], array[i]] = [array[i], array[0]];
        displayArray();

        // After the swap, mark the last element as sorted (green)
        bars[i].style.backgroundColor = 'green';

        await sleep(getSpeed()); // Delay for swap visualization

        // Heapify the reduced heap
        await heapify(i, 0);
    }
    
    // Turn the last remaining bar green (the smallest element)
    bars[0].style.backgroundColor = 'green';

    // Make all bars green after sorting is complete
    for (let j = 0; j < bars.length; j++) {
        bars[j].style.backgroundColor = 'green';
    }

    // Re-enable the buttons after sorting is complete
    sortButton.disabled = false;
    randomizeArrayButton.disabled = false;
}

// Heapify function for Heap Sort with color updates
async function heapify(n, i) {
    let bars = document.getElementsByClassName('bar');
    let largest = i;
    let left = 2 * i + 1;
    let right = 2 * i + 2;

    // Highlight the current node and its children in yellow
    bars[i].style.backgroundColor = 'yellow';
    if (left < n) bars[left].style.backgroundColor = 'yellow';
    if (right < n) bars[right].style.backgroundColor = 'yellow';

    await sleep(getSpeed()); // Pause to show the highlight

    // Find the largest among root, left child, and right child
    if (left < n && array[left] > array[largest]) {
        largest = left;
    }
    if (right < n && array[right] > array[largest]) {
        largest = right;
    }

    // Swap and heapify if the largest is not the root
    if (largest !== i) {
        [array[i], array[largest]] = [array[largest], array[i]];
        displayArray();

        // Reset the colors to blue after comparison
        bars[i].style.backgroundColor = 'blue';
        bars[largest].style.backgroundColor = 'blue';

        await sleep(getSpeed()); // Pause to show the swap
        await heapify(n, largest); // Recursively heapify the affected subtree
    } else {
        // Reset the colors to blue if no swap occurs
        bars[i].style.backgroundColor = 'blue';
        if (left < n) bars[left].style.backgroundColor = 'blue';
        if (right < n) bars[right].style.backgroundColor = 'blue';
    }
}

// Helper function to simulate sleep (delay)
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


// Function to call the appropriate sorting algorithm
function sortArray() {
    const algorithm = algorithmSelect.value;
    
    if (algorithm === 'bubble') bubbleSort();
    else if (algorithm === 'selection') selectionSort();
    else if (algorithm === 'quick') quickSort(0, array.length - 1);
    else if (algorithm === 'merge') mergeSort(0, array.length - 1);
    else if (algorithm === 'heap') heapSort();
}

// Event listeners for buttons
randomizeArrayButton.addEventListener('click', () => createRandomArray(sizeSlider.value));
sortButton.addEventListener('click', sortArray);

// Initialize the array based on slider value
createRandomArray(sizeSlider.value);