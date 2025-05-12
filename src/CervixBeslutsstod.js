
import React, { useState } from 'react';
import { jsPDF } from 'jspdf';

export default function CervixBeslutsstod() {
  const initialState = {
    alder: '',
    hpvTyp: 'negativ',
    persisterandeHPV: 'nej',
    cytologi: 'normal',
    pad: 'ingen',
    swedescore: 'ej utförd',
    vaccination: 'vet ej',
    resultat: ''
  };

  const [state, setState] = useState(initialState);

  const getRekommendation = () => {
    if (state.pad === 'invasiv cancer' || state.cytologi === 'misstanke invasiv cancer')
      return 'Kolposkopi snarast med SVF-remiss för invasiv cancer.';

    if (state.pad === 'AIS' || state.cytologi === 'AIS')
      return 'Kolposkopi snarast med SVF-remiss för AIS.';

    if (state.pad === 'HSIL' || state.cytologi === 'HSIL' || state.cytologi === 'ASC-H') {
      if (state.swedescore === '>7') return 'Behandling rekommenderas (excision/konisering).';
      if (state.swedescore === '<5') return 'Kolposkopisk kontroll snarast, excision om osäkerhet.';
      if (state.swedescore === 'ofullständig') return 'Ny kolposkopi snarast.';
      return 'Kolposkopi snarast för bedömning.';
    }

    if (state.pad === 'LSIL' || ['ASCUS', 'LSIL'].includes(state.cytologi))
      return 'Kolposkopisk kontroll inom 3–6 månader.';

    if (state.persisterandeHPV !== 'nej')
      return 'Kolposkopi bör utföras inom 3 månader oavsett cytologiskt svar.';

    if (state.hpvTyp === 'negativ' && state.cytologi === 'normal')
      return 'Åter till ordinarie screening enligt ålder (5–7 år).';

    if (state.hpvTyp === 'högonkogena' && state.cytologi === 'normal')
      return 'Ny kontroll med HPV och cytologi om 18 månader.';

    if (state.hpvTyp === 'medelonkogena' && state.cytologi === 'normal')
      return 'Ny kontroll med HPV och cytologi om 24 månader.';

    if (state.hpvTyp === 'lågonkogena' && state.cytologi === 'normal')
      return 'Ny kontroll med HPV och cytologi om 36 månader.';

    return 'Ej definierad kombination – diskutera med kolposkopist.';
  };

  
  const resetState = () => setState(initialState);

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Cervixdysplasi beslutsstöd", 20, 20);
    doc.text("Ålder: " + state.alder, 20, 30);
    doc.text("HPV-status: " + state.hpvTyp, 20, 40);
    doc.text("Persisterande HPV: " + state.persisterandeHPV, 20, 50);
    doc.text("Cytologi: " + state.cytologi, 20, 60);
    doc.text("PAD: " + state.pad, 20, 70);
    doc.text("Swedescore: " + state.swedescore, 20, 80);
    doc.text("Vaccination: " + state.vaccination, 20, 90);
    doc.text("Rekommendation:", 20, 110);
    doc.text(doc.splitTextToSize(state.resultat, 170), 20, 120);
    doc.save("rekommendation.pdf");
  };


  const FieldBlock = ({ label, children }) => (
    <div className="w-full text-center mb-4">
      <label className="block font-bold mb-1 text-center">{label}</label>
      <div className="flex justify-center">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-2xl p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Cervixdysplasi beslutsstöd</h2>

        <FieldBlock label="Ålder:">
          <input type="number" className="border p-2 w-full rounded" value={state.alder} onChange={(e) => setState({ ...state, alder: e.target.value })} />
        </FieldBlock>

        <FieldBlock label="HPV-status:">
          <select className="border p-2 w-full rounded" value={state.hpvTyp} onChange={(e) => setState({ ...state, hpvTyp: e.target.value })}>
            <option value="negativ">Negativ</option>
            <option value="högonkogena">Högonkogena HPV (16, 18, 45)</option>
            <option value="medelonkogena">Medelonkogena HPV (31, 33, 52, 58)</option>
            <option value="lågonkogena">Lågonkogena HPV (35, 39, 51, 56, 59, 66, 68)</option>
          </select>
        </FieldBlock>

        <FieldBlock label="Persisterande HPV-infektion:">
          <select className="border p-2 w-full rounded" value={state.persisterandeHPV} onChange={(e) => setState({ ...state, persisterandeHPV: e.target.value })}>
            <option value="nej">Nej</option>
            <option value="högonkogen">Högonkogen &gt;12 mån</option>
            <option value="medelonkogen">Medelonkogen &gt;30 mån</option>
            <option value="lågonkogen">Lågonkogen &gt;54 mån</option>
          </select>
        </FieldBlock>

        <FieldBlock label="Cytologisk diagnos:">
          <select className="border p-2 w-full rounded" value={state.cytologi} onChange={(e) => setState({ ...state, cytologi: e.target.value })}>
            <option value="normal">Normal</option>
            <option value="ASCUS">ASCUS</option>
            <option value="LSIL">LSIL</option>
            <option value="ASC-H">ASC-H</option>
            <option value="HSIL">HSIL</option>
            <option value="AGC">AGC</option>
            <option value="AIS">AIS</option>
            <option value="misstanke invasiv cancer">Misstanke invasiv cancer</option>
          </select>
        </FieldBlock>

        <FieldBlock label="PAD-svar:">
          <select className="border p-2 w-full rounded" value={state.pad} onChange={(e) => setState({ ...state, pad: e.target.value })}>
            <option value="ingen">Ingen PAD utförd</option>
            <option value="LSIL">LSIL</option>
            <option value="HSIL">HSIL</option>
            <option value="AIS">AIS</option>
            <option value="invasiv cancer">Invasiv cancer</option>
          </select>
        </FieldBlock>

        <FieldBlock label="Swedescore:">
          <select className="border p-2 w-full rounded" value={state.swedescore} onChange={(e) => setState({ ...state, swedescore: e.target.value })}>
            <option value="ej utförd">Kolposkopi ej utförd</option>
            <option value="ofullständig">Ofullständig kolposkopi</option>
            <option value="<5">Swedescore &lt;5</option>
            <option value=">7">Swedescore &gt;7</option>
          </select>
        </FieldBlock>

        <FieldBlock label="Tidigare HPV-vaccination:">
          <select className="border p-2 w-full rounded" value={state.vaccination} onChange={(e) => setState({ ...state, vaccination: e.target.value })}>
            <option value="vet ej">Vet ej</option>
            <option value="ej vaccinerad">Ej vaccinerad</option>
            <option value="Gardasil">Vaccinerad med Gardasil</option>
            <option value="Gardasil-9">Vaccinerad med Gardasil-9</option>
          </select>
        </FieldBlock>

        <div className="flex flex-col items-center space-y-2 mt-6">
          <button className="w-full max-w-sm bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded" onClick={() => setState({ ...state, resultat: getRekommendation() })}>
            Visa rekommendation
          </button>
          <button className="w-full max-w-sm bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded" onClick={resetState}>
            Nollställ
          </button>
        </div>

        {state.resultat && (
          <div className="mt-6 p-4 bg-green-100 border border-green-400 rounded max-w-md mx-auto text-center">
            <strong>Rekommendation:</strong>
            <p>{state.resultat}</p>

<button className="mt-2 bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded" onClick={exportToPDF}>
  Exportera till PDF
</button>
          </div>
        )}
      </div>
    </div>
  );
}
