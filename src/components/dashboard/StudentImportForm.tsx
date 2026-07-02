'use client'

import { useState } from "react"
import { importStudents } from "@/actions/student"
import { Download, Upload, Clipboard, Check, AlertTriangle, RefreshCw, ChevronRight } from "lucide-react"
import Link from "next/link"

export default function StudentImportForm() {
    const [activeTab, setActiveTab] = useState<"file" | "paste">("file")
    const [csvFile, setCsvFile] = useState<File | null>(null)
    const [pasteText, setPasteText] = useState("")
    const [parsedData, setParsedData] = useState<{ nis: string; name: string; class: string }[]>([])
    const [errorMessage, setErrorMessage] = useState("")
    const [successMessage, setSuccessMessage] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [logDetails, setLogDetails] = useState<string[]>([])

    // Download CSV template client-side
    const handleDownloadTemplate = () => {
        const headers = 'nis,name,class\n'
        const sampleRows = '10001,Ahmad Rifai,9-A\n10002,Siti Aminah,8-B\n10003,Budi Santoso,7-C\n'
        const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(headers + sampleRows)
        const link = document.createElement("a")
        link.setAttribute("href", csvContent)
        link.setAttribute("download", "template_import_siswa.csv")
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    // Custom CSV parser
    const parseCSVText = (text: string) => {
        try {
            const lines = text.split(/\r?\n/)
            if (lines.length === 0 || !lines[0].trim()) {
                throw new Error("File kosong atau tidak memiliki baris.")
            }

            // Detect delimiter
            const headerLine = lines[0]
            let delimiter = ','
            if (headerLine.includes(';')) {
                delimiter = ';'
            }

            const headers = headerLine.split(delimiter).map(h => h.trim().toLowerCase().replace(/['"]/g, ''))

            // Map standard headers (Indonesian / English translation)
            const nisIndex = headers.findIndex(h => h === 'nis')
            const nameIndex = headers.findIndex(h => h === 'name' || h === 'nama')
            const classIndex = headers.findIndex(h => h === 'class' || h === 'kelas')

            if (nisIndex === -1 || nameIndex === -1 || classIndex === -1) {
                throw new Error("Header kolom tidak lengkap. Pastikan file memiliki kolom 'nis', 'name' atau 'nama', dan 'class' atau 'kelas'.")
            }

            const rows: { nis: string; name: string; class: string }[] = []
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim()
                if (!line) continue

                const cols = line.split(delimiter).map(c => c.trim().replace(/^['"]|['"]$/g, ''))
                
                if (cols.length <= Math.max(nisIndex, nameIndex, classIndex)) {
                    continue // Skip incomplete lines
                }

                rows.push({
                    nis: cols[nisIndex],
                    name: cols[nameIndex],
                    class: cols[classIndex]
                })
            }

            setParsedData(rows)
            setErrorMessage("")
        } catch (error: any) {
            setErrorMessage(error.message || "Gagal membaca file CSV.")
            setParsedData([])
        }
    }

    // File input change handler
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setCsvFile(file)
        setSuccessMessage("")
        setLogDetails([])

        const reader = new FileReader()
        reader.onload = (event) => {
            const text = event.target?.result as string
            parseCSVText(text)
        }
        reader.readAsText(file)
    }

    // Parse Excel/Spreadsheet pasted content (TAB separated values)
    const handlePasteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value
        setPasteText(val)
        setSuccessMessage("")
        setLogDetails([])

        if (!val.trim()) {
            setParsedData([])
            setErrorMessage("")
            return
        }

        try {
            const lines = val.split(/\r?\n/)
            const rows: { nis: string; name: string; class: string }[] = []
            
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim()
                if (!line) continue

                const cols = line.split('\t').map(c => c.trim())
                
                if (cols.length < 3) continue

                // Skip header row if it looks like one
                if (i === 0 && (
                    cols[0].toLowerCase().includes('nis') || 
                    cols[1].toLowerCase().includes('nama') || 
                    cols[2].toLowerCase().includes('kelas') ||
                    cols[1].toLowerCase().includes('name') || 
                    cols[2].toLowerCase().includes('class')
                )) {
                    continue
                }

                rows.push({
                    nis: cols[0],
                    name: cols[1],
                    class: cols[2]
                })
            }

            setParsedData(rows)
            setErrorMessage("")
        } catch (error) {
            setErrorMessage("Gagal memproses data paste.")
            setParsedData([])
        }
    }

    // Submit Action
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (parsedData.length === 0) return

        setIsLoading(true)
        setSuccessMessage("")
        setErrorMessage("")
        setLogDetails([])

        try {
            const result = await importStudents(parsedData)

            if (result.error) {
                setErrorMessage(result.error)
                if (result.details) {
                    setLogDetails(result.details)
                }
            } else {
                setSuccessMessage(result.message || "Data berhasil diimpor!")
                if (result.details) {
                    setLogDetails(result.details)
                }
                // Clear input
                setCsvFile(null)
                setPasteText("")
                setParsedData([])
            }
        } catch (error) {
            setErrorMessage("Terjadi kesalahan sistem saat memproses impor data.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            {successMessage && (
                <div className="rounded-xl bg-emerald-50 p-4 text-emerald-700 border border-emerald-100 font-medium">
                    <p className="flex items-center gap-2">
                        <Check className="shrink-0 text-emerald-600" size={20} />
                        {successMessage}
                    </p>
                </div>
            )}

            {errorMessage && (
                <div className="rounded-xl bg-red-50 p-4 text-red-700 border border-red-100 font-medium">
                    <p className="flex items-center gap-2">
                        <AlertTriangle className="shrink-0 text-red-600" size={20} />
                        {errorMessage}
                    </p>
                </div>
            )}

            {logDetails.length > 0 && (
                <div className="rounded-xl bg-amber-50 p-4 text-amber-800 border border-amber-100 text-sm max-h-48 overflow-y-auto">
                    <p className="font-bold mb-2 flex items-center gap-2">
                        <AlertTriangle className="text-amber-600" size={16} />
                        Beberapa baris tidak berhasil diproses / dilewati:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                        {logDetails.map((log, index) => (
                            <li key={index}>{log}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Template Download Guide Section */}
            <div className="rounded-2xl border border-stroke bg-white p-6 shadow-default flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h3 className="font-bold text-black text-lg">Gunakan Template Impor</h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Unduh template CSV resmi untuk memastikan format kolom sudah benar (NIS, Nama, Kelas).
                    </p>
                </div>
                <button
                    type="button"
                    onClick={handleDownloadTemplate}
                    className="flex items-center justify-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-black px-5 py-3 text-sm font-bold transition shrink-0"
                >
                    <Download size={16} />
                    Unduh Template CSV
                </button>
            </div>

            {/* Import Methods Panel */}
            <div className="rounded-2xl border border-stroke bg-white shadow-default overflow-hidden">
                <div className="flex border-b border-stroke bg-gray-50">
                    <button
                        type="button"
                        onClick={() => { setActiveTab("file"); setParsedData([]); setErrorMessage("") }}
                        className={`flex-1 py-4 px-6 font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition ${activeTab === "file" ? "border-blue-600 text-blue-600 bg-white" : "border-transparent text-gray-500 hover:text-black"}`}
                    >
                        <Upload size={16} />
                        Upload File CSV
                    </button>
                    <button
                        type="button"
                        onClick={() => { setActiveTab("paste"); setParsedData([]); setErrorMessage("") }}
                        className={`flex-1 py-4 px-6 font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition ${activeTab === "paste" ? "border-blue-600 text-blue-600 bg-white" : "border-transparent text-gray-500 hover:text-black"}`}
                    >
                        <Clipboard size={16} />
                        Copy-Paste Excel
                    </button>
                </div>

                <div className="p-8">
                    {activeTab === "file" ? (
                        <div className="space-y-4">
                            <label className="block text-sm font-bold text-black uppercase tracking-wider mb-2">
                                Pilih File CSV
                            </label>
                            <div className="border-2 border-dashed border-stroke rounded-2xl p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer relative">
                                <input
                                    type="file"
                                    accept=".csv"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <Upload className="text-gray-400 mb-3" size={40} />
                                <p className="font-medium text-black">
                                    {csvFile ? csvFile.name : "Klik atau seret file CSV ke sini"}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Format file harus berupa .csv (maksimal 5MB)
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <label className="block text-sm font-bold text-black uppercase tracking-wider mb-2">
                                Tempel Kolom Spreadsheet
                            </label>
                            <textarea
                                value={pasteText}
                                onChange={handlePasteChange}
                                rows={6}
                                placeholder="Tempel data Excel/Google Sheets Anda di sini.&#10;Contoh format kolom:&#10;NIS   Nama Siswa   Kelas&#10;10001   Ahmad Fauzi   9-A&#10;10002   Siti Aminah   8-B"
                                className="w-full rounded-xl border-2 border-stroke bg-transparent py-4 px-5 font-mono text-sm outline-none transition focus:border-blue-600 active:border-blue-600 placeholder:text-gray-400"
                            ></textarea>
                            <p className="text-xs text-gray-500">
                                💡 Tip: Buka aplikasi spreadsheet, blok 3 kolom berisi <strong>NIS</strong>, <strong>Nama</strong>, dan <strong>Kelas</strong> (termasuk atau tanpa header), salin (Ctrl+C), lalu klik area di atas dan tempel (Ctrl+V).
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Preview Section */}
            {parsedData.length > 0 && (
                <div className="rounded-2xl border border-stroke bg-white shadow-default overflow-hidden">
                    <div className="border-b border-stroke py-4 px-6.5 bg-gray-50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Check className="text-emerald-600" size={20} />
                            <h3 className="font-bold text-black uppercase tracking-tight">Pratinjau Data Impor ({parsedData.length} siswa)</h3>
                        </div>
                        <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2.5 py-1 rounded-full uppercase">
                            Siap Diimpor
                        </span>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-100 border-b border-stroke">
                                    <th className="py-3 px-6 text-sm font-bold text-gray-600">No</th>
                                    <th className="py-3 px-6 text-sm font-bold text-gray-600">NIS</th>
                                    <th className="py-3 px-6 text-sm font-bold text-gray-600">Nama Siswa</th>
                                    <th className="py-3 px-6 text-sm font-bold text-gray-600">Kelas</th>
                                </tr>
                            </thead>
                            <tbody>
                                {parsedData.slice(0, 50).map((row, index) => (
                                    <tr key={index} className="border-b border-stroke hover:bg-gray-50">
                                        <td className="py-3 px-6 text-sm text-gray-500 font-mono">{index + 1}</td>
                                        <td className="py-3 px-6 text-sm text-gray-600 font-mono">{row.nis}</td>
                                        <td className="py-3 px-6 text-sm font-medium text-black">{row.name}</td>
                                        <td className="py-3 px-6 text-sm font-semibold text-blue-700">
                                            <span className="bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                                                {row.class}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {parsedData.length > 50 && (
                            <div className="p-4 bg-slate-50 text-center text-sm font-medium text-gray-500 border-t border-stroke">
                                Menampilkan 50 data pertama dari total {parsedData.length} data siswa.
                            </div>
                        )}
                    </div>

                    <div className="p-6 bg-gray-50 border-t border-stroke flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => { setParsedData([]); setCsvFile(null); setPasteText("") }}
                            className="rounded-xl border border-stroke bg-white px-6 py-3.5 font-bold text-gray-600 transition hover:bg-gray-100"
                        >
                            Reset
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-10 py-3.5 font-black text-white transition-all shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-xl active:scale-95 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <>
                                    <RefreshCw className="animate-spin" size={18} />
                                    MEMPROSES...
                                </>
                            ) : (
                                <>
                                    MULAI IMPOR DATA
                                    <ChevronRight size={18} />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
