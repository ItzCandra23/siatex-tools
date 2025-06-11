
export default function main() {
    alert("Activated");
    
    window.soal_data = [];

    [
        { name: "SalinSemua", onclick: SalinSemua },
        { name: "SalinSaatIni", onclick: SalinSoalSaatIni },
        { name: "Salin(FirstHalf)", onclick: SalinFirstHalf },
        { name: "Salin(LastHalf)", onclick: SalinLastHalf },
        { name: "SalinFormData", onclick: SalinFormData },
        { name: "TerapkanFormData", onclick: TerapkanFormData },
        { name: "BandingkanFormData", onclick: BandingkanFormData }
    ].forEach(({ name, onclick }) => {
        $("<div>")
            .addClass("btn btn-info")
            .text(name)
            .on("click", onclick)
            .appendTo("#collapseExample");
    });

    $(".panel-body .step").each(function () {
        const soal_elmt = $(this).clone();
        const funkyradio = soal_elmt.find(".funkyradio");

        if (funkyradio.length) {
            const pilihan_elmt = funkyradio.clone();
            funkyradio.remove();

            let jawaban = [];
            pilihan_elmt.find("label").each(function () {
                jawaban.push(extractTextAndImages(this));
            });

            window.soal_data.push({
                soal: extractTextAndImages(soal_elmt[0]),
                jawaban
            });
        }
    });

    function soalObjectToText(soal_data, no) {
        return `${no ? no + ". " : ""}${soal_data.soal}\n${soal_data.jawaban.join("\n")}`;
    }

    function SalinSemua() {
        if (!window.soal_data.length) {
            alert("Data soal belum tersedia!");
            return;
        }
        const result = window.soal_data
            .map((s, i) => soalObjectToText(s, i + 1))
            .join("\n\n");
        navigator.clipboard.writeText(result);
    }

    function SalinSoalSaatIni() {
        if (!window.soal_data.length) {
            alert("Data soal belum tersedia!");
            return;
        }
        const index = +($("#soalke").text() || 1) - 1;
        if (index < 0 || index >= window.soal_data.length) {
            alert("Nomor soal tidak valid!");
            return;
        }
        const result = soalObjectToText(window.soal_data[index], index + 1);
        navigator.clipboard.writeText(result);
    }

    function SalinFirstHalf() {
        if (!window.soal_data.length) {
            alert("Data soal belum tersedia!");
            return;
        }
        const half = Math.floor(window.soal_data.length / 2);
        const result = window.soal_data
            .slice(0, half)
            .map((s, i) => soalObjectToText(s, i + 1))
            .join("\n\n");
        navigator.clipboard.writeText(result);
    }

    function SalinLastHalf() {
        if (!window.soal_data.length) {
            alert("Data soal belum tersedia!");
            return;
        }
        const half = Math.floor(window.soal_data.length / 2);
        const result = window.soal_data
            .slice(half)
            .map((s, i) => soalObjectToText(s, half + i + 1))
            .join("\n\n");
        navigator.clipboard.writeText(result);
    }

    function SalinFormData() {
        const data = window.getFormData($("#_form"));
        navigator.clipboard.writeText(JSON.stringify(data));
    }

    function TerapkanFormData() {
        const local_form = window.getFormData($("#_form"));
        const input = prompt("Masukkan Form Data:");
        if (!input) return;

        let data_form;
        try {
            data_form = Object.entries(JSON.parse(input));
        } catch (e) {
            alert("Format Form Data tidak valid!");
            return;
        }

        const data_simpan = [];

        for (const [k, v] of Object.entries(local_form)) {
            if (!k.startsWith("id_soal_")) continue;

            const jwb_id = data_form.find(([_, val]) => val === v);
            if (!jwb_id) continue;

            const jawaban = data_form.find(([key]) => `opsi_${jwb_id[0].substring(8)}` === key);
            if (!jawaban) continue;

            document.querySelector("input#").select();
        }

        window.simpan();
    }

  function BandingkanFormData() {
        const local_form = window.getFormData($("#_form"));
        const input = prompt("Masukkan Form Data:");
        if (!input) return;

        let data_form;
        try {
            data_form = Object.entries(JSON.parse(input));
        } catch (e) {
            alert("Format Form Data tidak valid!");
            return;
        }

        const data_simpan = [];

        for (const [k, v] of Object.entries(local_form)) {
            if (!k.startsWith("id_soal_")) continue;

            const jwb_id = data_form.find(([_, val]) => val === v);
            if (!jwb_id) continue;

            const jawaban = data_form.find(([key]) => `opsi_${jwb_id[0].substring(8)}` === key);
            if (!jawaban) continue;

            data_simpan.push({
                no: k.substring(8),
                jawab: jawaban[1]
            });
        }

        navigator.clipboard.writeText(JSON.stringify(data_simpan, null, 2));
    }

    function extractTextAndImages(el) {
        let result = "";

        el.childNodes.forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                result += node.textContent.trim() + " ";
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.tagName === "IMG") {
                    result += `"${node.src}" `;
                } else {
                    result += extractTextAndImages(node) + " ";
                }
            }
        });

        return result.trim();
    }
}
