/*
 * Copyright (c) 2024. Devtron Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Diagnostic } from '@codemirror/lint'
import { EditorView } from '@uiw/react-codemirror'
import YAML, { YAMLParseError } from 'yaml'

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
