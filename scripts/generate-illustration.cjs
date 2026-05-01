const fs = require('fs')
const path = require('path')
const { execFile } = require('child_process')

// Base path relative to the current script
const basePath = path.resolve(__dirname, '../src')

// Directory containing SVG, Webp illustrations and the output file
const illustrationsDir = path.join(basePath, 'Assets', 'Illustration')
const outputFile = path.join(basePath, 'Shared', 'Components', 'Illustration', 'Illustration.tsx')

const runBiome = (filePath) => {
    execFile('npx', ['@biomejs/biome', 'check', '--fix', filePath], (error, stdout, stderr) => {
        if (error) {
            console.error(`Error running Biome: ${error.message}`)
            return
        }
        if (stderr) {
            console.error(`Biome stderr: ${stderr}`)
        }
        if (stdout) {
            console.log(`Biome output:\n${stdout}`)
        }
        console.log('Biome completed successfully.')
    })
}

const generateIllustrationComponent = () => {
    // Read all files in the illustrations directory
    const files = fs.readdirSync(illustrationsDir)

    // Filter for SVG files
    const svgFiles = files.filter((file) => file.endsWith('.svg'))
    // Filter for WEBP files
    const webpFiles = files.filter((file) => file.endsWith('.webp'))

    // Generate import statements and the illustration map
    const imports = []
    const illustrationMapEntries = []

    svgFiles.forEach((file) => {
        // Remove the .svg extension
        const illustrationName = path.basename(file, '.svg')
        // Convert illustration-name to IllustrationName for importName
        const importName = illustrationName
            .split('-')
            .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
            .join('')
        // Push imports statement
        imports.push(`import ${importName} from '@Illustrations/${file}?react'`)
        // Push illustrations to illustrationMap
        illustrationMapEntries.push(`["${illustrationName}"]: ${importName},`)
    })

    webpFiles.forEach((file) => {
        // Remove the .webp extension
        const illustrationName = path.basename(file, '.webp')
        // Convert illustration-name to IllustrationName for importName
        const importName = illustrationName.replace(/(^\w|-\w)/g, (match) => match.replace('-', '').toUpperCase())
        // Push imports statement
        imports.push(`import ${importName} from '@Illustrations/${file}'`)
        // Push illustrations to illustrationMap
        illustrationMapEntries.push(`["${illustrationName}"]: ${importName},`)
    })

    // Generate the Illustration.tsx content
    const content = `
    // NOTE: This file is auto-generated. Do not edit directly. Run the script \`npm run generate-illustration\` to update.

    ${imports.join('\n')}

    import { IllustrationBase } from './IllustrationBase';
    import { IllustrationBaseProps } from './types';

    export const illustrationMap = {
        ${illustrationMapEntries.join('\n')}
    };

    export type IllustrationName = keyof typeof illustrationMap;

    export interface IllustrationProps extends Omit<IllustrationBaseProps, 'name' | 'illustrationMap'> {
        /**
         * The name of the illustration to render.
         * @note The component will return either an img component or an SVG component based on the type of illustration (.svg, .webp)
         */
        name: keyof typeof illustrationMap;
    }

    export const Illustration = (props: IllustrationProps) => {
        return <IllustrationBase {...props} illustrationMap={illustrationMap} />;
    };
`

    // Write the content to the Illustration.tsx file
    fs.writeFileSync(outputFile, content.trim(), 'utf-8')
    console.log(`Illustration component file generated at: ${outputFile}`)

    // Run Biome on the generated file
    runBiome(outputFile)
}

// Run the script
generateIllustrationComponent()
