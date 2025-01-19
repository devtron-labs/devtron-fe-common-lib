import YAML, { YAMLParseError } from 'yaml'
// eslint-disable-next-line import/no-extraneous-dependencies
import { Diagnostic, linter } from '@codemirror/lint'

export const yamlParseErrorLint = () =>
    linter((view): Diagnostic[] => {
        const errors: Diagnostic[] = []
        const text = view.state.doc.toString()

        try {
            // Parse YAML
            YAML.parse(text)
        } catch (err) {
            // Handle YAML syntax errors
            if (err instanceof YAMLParseError) {
                const { linePos = [], message } = err
                const { from } = view.state.doc.line(linePos[0]?.line || 0)

                errors.push({
                    from,
                    to: from + (linePos[0]?.col || 0),
                    message,
                    severity: 'error',
                    source: err.name,
                })
            } else {
                errors.push({
                    from: 0,
                    to: text.length,
                    message: err instanceof Error ? err.message : 'Unknown error',
                    severity: 'error',
                    source: err.name,
                })
            }
        }

        return errors
    })
