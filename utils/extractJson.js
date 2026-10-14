// const extractJson = async (text) => {
//     if (!text) {
//         return
//     }
//     const cleaned = text.
//         replace(/```json/gi, "")
//         .replace(/```/g, "")
//         .trim();

//     const firstBrace=cleaned.indexOf('{')
//     const closeBrace=cleaned.lastIndexOf('}')
//     if(firstBrace===-1 || closeBrace===-1)return null
//     const jsonString=cleaned.slice(firstBrace,closeBrace+1)
    
//     return JSON.parse(jsonString)

// }

// export default extractJson




const extractJson = async (text) => {
    if (!text) {
        return null;
    }

    const cleaned = text
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

    const firstBrace = cleaned.indexOf("{");
    const closeBrace = cleaned.lastIndexOf("}");

    if (firstBrace === -1 || closeBrace === -1) {
        return null;
    }

    const jsonString = cleaned.slice(
        firstBrace,
        closeBrace + 1
    );

    console.log("JSON length:", jsonString.length);

    try {
        return JSON.parse(jsonString);
    } catch (error) {
        console.error(
            "JSON parsing failed:",
            error.message
        );

        const match = error.message.match(/position (\d+)/);

        if (match) {
            const position = Number(match[1]);

            console.error(
                "Invalid JSON near:",
                jsonString.slice(
                    Math.max(0, position - 100),
                    position + 100
                )
            );

            console.error(
                "Character at error position:",
                JSON.stringify(jsonString[position])
            );

            console.error(
                "Character code:",
                jsonString.charCodeAt(position)
            );
        }

        throw error;
    }
};

export default extractJson




// const extractJson = async (text) => {
//     if (!text || typeof text !== "string") {
//         return null;
//     }

//     // 1. Remove Markdown code fences
//     let cleaned = text
//         .replace(/^\uFEFF/, "")
//         .replace(/```(?:json|javascript|js)?\s*/gi, "")
//         .replace(/```/g, "")
//         .trim();

//     // 2. Extract the outermost JSON object
//     const firstBrace = cleaned.indexOf("{");
//     const lastBrace = cleaned.lastIndexOf("}");

//     if (firstBrace === -1 || lastBrace <= firstBrace) {
//         console.error("No JSON object found in AI response");
//         return null;
//     }

//     let jsonString = cleaned.slice(firstBrace, lastBrace + 1);

//     // 3. First, try parsing the original JSON
//     try {
//         return JSON.parse(jsonString);
//     } catch (error) {
//         console.warn("Initial JSON parsing failed:", error.message);
//     }

//     // 4. Repair common JSON syntax problems
//     const repairJson = (input) => {
//         let result = "";
//         let inString = false;
//         let quote = "";
//         let escaped = false;

//         for (let i = 0; i < input.length; i++) {
//             const char = input[i];

//             // Inside a quoted string
//             if (inString) {
//                 if (escaped) {
//                     // Preserve valid JSON escape sequences.
//                     // Escape invalid backslashes.
//                     if (!/["\\/bfnrtu]/.test(char)) {
//                         result += "\\\\";
//                     } else {
//                         result += "\\";
//                     }

//                     result += char;
//                     escaped = false;
//                     continue;
//                 }

//                 if (char === "\\") {
//                     escaped = true;
//                     continue;
//                 }

//                 if (char === quote) {
//                     // A quote closes the string only when followed
//                     // by a valid JSON delimiter.
//                     const rest = input.slice(i + 1);
//                     const next = rest.match(/^\s*(.)/);
//                     const nextChar = next ? next[1] : "";

//                     if (
//                         quote === '"' ||
//                         nextChar === ":" ||
//                         nextChar === "," ||
//                         nextChar === "}" ||
//                         nextChar === "]" ||
//                         nextChar === ""
//                     ) {
//                         inString = false;
//                         result += '"';
//                     } else {
//                         // Treat an unexpected quote as string content
//                         result += '\\"';
//                     }
//                     continue;
//                 }

//                 // JSON does not allow literal newlines in strings
//                 if (char === "\n") {
//                     result += "\\n";
//                 } else if (char === "\r") {
//                     result += "\\r";
//                 } else if (char === "\t") {
//                     result += "\\t";
//                 } else {
//                     result += char;
//                 }

//                 continue;
//             }

//             // Outside a string
//             if (char === '"' || char === "'") {
//                 inString = true;
//                 quote = char;
//                 result += '"';
//                 continue;
//             }

//             result += char;
//         }

//         // Preserve a final unmatched backslash inside a string
//         if (escaped) {
//             result += "\\\\";
//         }

//         // Close a string if the response ended before its closing quote
//         if (inString) {
//             result += '"';
//         }

//         // Remove trailing commas: {"a":1,} and [1,2,]
//         result = result.replace(/,\s*([}\]])/g, "$1");

//         return result;
//     };

//     // 5. Try repaired JSON
//     const repaired = repairJson(jsonString);

//     try {
//         return JSON.parse(repaired);
//     } catch (error) {
//         console.error("JSON parsing failed after repair:", error.message);
//         console.error("Original JSON length:", jsonString.length);

//         const match = error.message.match(/position (\d+)/);

//         if (match) {
//             const position = Number(match[1]);

//             console.error(
//                 "Problem area:",
//                 repaired.slice(
//                     Math.max(0, position - 150),
//                     position + 150
//                 )
//             );
//         }

//         // Let the controller handle the failure
//         throw new Error(
//             `Unable to extract valid JSON from AI response: ${error.message}`
//         );
//     }
// };

// export default extractJson;






// const extractJson = (text) => {
//     if (typeof text !== "string" || !text.trim()) {
//         throw new Error("AI returned an empty response");
//     }

//     const cleaned = text
//         .replace(/^\uFEFF/, "")
//         .trim();

//     // 1. Try parsing the complete response directly
//     try {
//         return JSON.parse(cleaned);
//     } catch {
//         // Continue with extraction
//     }

//     // 2. Remove Markdown code fences, including ```json and plain ```
//     const withoutFences = cleaned
//         .replace(/```(?:json|javascript|js)?[ \t]*\r?\n?/gi, "")
//         .trim();

//     try {
//         return JSON.parse(withoutFences);
//     } catch {
//         // Continue with extraction
//     }

//     // 3. Find complete JSON objects while respecting quoted strings
//     for (let start = 0; start < withoutFences.length; start++) {
//         if (withoutFences[start] !== "{") continue;

//         let depth = 0;
//         let inString = false;
//         let escaped = false;

//         for (let i = start; i < withoutFences.length; i++) {
//             const char = withoutFences[i];

//             if (inString) {
//                 if (escaped) {
//                     escaped = false;
//                 } else if (char === "\\") {
//                     escaped = true;
//                 } else if (char === '"') {
//                     inString = false;
//                 }

//                 continue;
//             }

//             if (char === '"') {
//                 inString = true;
//             } else if (char === "{") {
//                 depth++;
//             } else if (char === "}") {
//                 depth--;

//                 if (depth === 0) {
//                     const candidate = withoutFences.slice(start, i + 1);

//                     try {
//                         const parsed = JSON.parse(candidate);

//                         if (
//                             parsed !== null &&
//                             typeof parsed === "object" &&
//                             !Array.isArray(parsed)
//                         ) {
//                             return parsed;
//                         }
//                     } catch {
//                         // This object was invalid; try the next candidate
//                     }

//                     break;
//                 }
//             }
//         }
//     }

//     // 4. Report useful debugging information
//     const error = new Error(
//         "Could not extract valid JSON. The AI response may be malformed or truncated."
//     );

//     error.responseLength = cleaned.length;
//     error.responseEnd = cleaned.slice(-500);

//     throw error;
// };

// export default extractJson;



