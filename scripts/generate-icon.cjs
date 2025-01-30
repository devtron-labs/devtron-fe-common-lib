const fs = require('fs')
const path = require('path')
const { exec } = require('child_process')

// Base path relative to the current script
const basePath = path.resolve(__dirname, '../src')

// Directory containing SVG icons and the output file
const iconsDir = path.join(basePath, 'Assets', 'IconV2')
const outputFile = path.join(basePath, 'Shared', 'Components', 'Icon', 'Icon.tsx')

const runESLint = (filePath) => {
    exec(`npx eslint ${filePath} --fix`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error running ESLint: ${error.message}`)
            return
        }
        if (stderr) {
            console.error(`ESLint stderr: ${stderr}`)
        }
        if (stdout) {
            console.log(`ESLint output:\n${stdout}`)
        }
        console.log('ESLint completed successfully.')
    })
}

const generateIconComponent = () => {
    // Read all files in the icons directory
    const files = fs.readdirSync(iconsDir)

    // Filter for SVG files
    const svgFiles = files.filter((file) => file.endsWith('.svg'))

    // Generate import statements and the icon map
    const imports = []
    const iconMapEntries = []

    svgFiles.forEach((file) => {
        // Remove the .svg extension
        const iconName = path.basename(file, '.svg')
        // Convert icon-name to IconName for importName
        const importName = iconName
            .replace(/(^\w+)/, (match) => match.toUpperCase())
            .replace(/-./g, (match) => match[1].toUpperCase())
        // Push imports statement
        imports.push(`import { ReactComponent as ${importName} } from '@IconsV2/${file}'`)
        // Push icons to iconMap
        iconMapEntries.push(`["${iconName}"]: ${importName},`)
    })

    // Generate the Icon.tsx content
    const content = `
    // NOTE: This file is auto-generated. Do not edit directly. Run the script \`npm run generate-icon\` to update.

    ${imports.join('\n')}

    // eslint-disable-next-line no-restricted-imports
    import { IconBase } from './IconBase';
    import { IconBaseProps } from './types';

    export const iconMap = {
        ${iconMapEntries.join('\n')}
    };

    export type IconName = keyof typeof iconMap;

    export interface IconsProps extends Omit<IconBaseProps, 'name' | 'iconMap'> {
        name: keyof typeof iconMap;
    }

    export const Icon = (props: IconsProps) => {
        return <IconBase {...props} iconMap={iconMap} />;
    };
`

    // Write the content to the Icon.tsx file
    fs.writeFileSync(outputFile, content.trim(), 'utf-8')
    console.log(`Icon component file generated at: ${outputFile}`)

    // Run ESLint on the generated file
    runESLint(outputFile)
}

// Run the script
generateIconComponent()
