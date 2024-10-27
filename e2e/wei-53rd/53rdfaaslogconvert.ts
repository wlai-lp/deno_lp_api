// faas log comes in as
//6407d363-f208-4aec-a5ba-e45f125c761e;c22e6ec6-6321-ee43-5132-e9e9dd6a3fa9;Mon, 20 May 2024 19:59:16 GMT;Info;SUCCESS;"[""{\""1729987630\"":-1,\""1729988130\"":-1,\""1896040130\"":-1,\""1896041030\"":-1,\""3420791130\"":-1,\""3985289638\"":-1,\""4238410938\"":-1}""]"
//6407d363-f208-4aec-a5ba-e45f125c761e;c22e6ec6-6321-ee43-5132-e9e9dd6a3fa9;Mon, 20 May 2024 19:59:16 GMT;Info;"toMillis: 1716235156211 ; fromMillis: 1716231556211";[]
// Import necessary modules
// Import necessary modules
import { TextDecoderStream } from "https://deno.land/std/streams/mod.ts";

// Function to process two lines at a time using stream API
async function processFileTwoLinesAtATime(filePath: string) {
  // Open the file as a readable stream
  const file = await Deno.open(filePath, { read: true });

  // Create a text decoder stream to decode Uint8Array chunks to strings
  const textStream = file.readable.pipeThrough(new TextDecoderStream());

  // Create a reader from the text stream
  const reader = textStream.getReader();

  // Variables to store lines
  let line1: string | null = null;
  let line2: string | null = null;
  let buffer = '';

  try {
    while (true) {
      // Read the next chunk of text
      const { value, done } = await reader.read();
      if (done) break;
      buffer += value;

      // Split the buffer into lines
      let lines = buffer.split('\n');

      // Process each line
      for (let i = 0; i < lines.length - 1; i++) {
        if (line1 === null) {
          line1 = lines[i];
        } else {
          line2 = lines[i];
          // Process the pair of lines
          console.log("Processing pair:");
          console.log("Line 1:", line1);
          console.log("Line 2:", line2);

          // Reset line1 and line2 for the next pair
          line1 = null;
          line2 = null;
        }
      }

      // Retain the last line segment (incomplete line) in buffer
      buffer = lines[lines.length - 1];
    }

    // If there's an incomplete line left in buffer, process it
    if (line1 !== null) {
      console.log("Processing last line (no pair):");
      console.log("Line 1:", line1);
    } else if (buffer.length > 0) {
      console.log("Processing last line (no pair):");
      console.log("Line 1:", buffer);
    }
  } finally {
    // Close the file
    file.close();
  }
}

// Example usage
const filePath = "./example.txt";
await processFileTwoLinesAtATime(filePath);
