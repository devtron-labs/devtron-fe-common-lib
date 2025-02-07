import YAML, { YAMLParseError } from 'yaml'
import { EditorView } from '@uiw/react-codemirror'
import { Diagnostic } from '@codemirror/lint'

export const yamlParseLinter =
    () =>
    (view: EditorView): Diagnostic[] => {
        const diagnostics: Diagnostic[] = []
        const text = view.state.doc.toString()

        try {
            // Parse YAML
            const documents = YAML.parseAllDocuments(text)

            // Handle YAML parse errors
            documents.forEach(({ errors }) => {
                errors.forEach((err) => {
                    if (err instanceof YAMLParseError) {
                        const { linePos = [], message } = err
                        const { from } = view.state.doc.line(linePos[0]?.line || 0)

                        diagnostics.push({
                            from,
                            to: Math.min(from + (linePos[0]?.col || 0), text.length),
                            message: message.replace(/\n+/g, '\n'),
                            severity: 'error',
                            source: err.name,
                        })
                    } else {
                        diagnostics.push({
                            from: 0,
                            to: text.length,
                            message: err instanceof Error ? err.message : 'Unknown error',
                            severity: 'error',
                            source: err.name,
                        })
                    }
                })
            })
        } catch (err) {
            diagnostics.push({
                from: 0,
                to: text.length,
                message: err instanceof Error ? err.message : 'Yaml lint failed',
                severity: 'error',
                source: err.name,
            })
        }

        return diagnostics
    }
