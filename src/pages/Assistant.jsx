import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MessageSquare, Send, Loader, ShieldAlert, BookOpenCheck, Sparkles, Bot, ArrowRight } from 'lucide-react';
import { assistantAPI } from '../services/api';
import { useRecommendationStore } from '../store/recommendationStore';

const initialMessages = [
  {
    role: 'assistant',
    content:
      'Hola, soy tu asistente academico. Puedo ayudarte con reglas de malla, prerequisitos y recomendaciones. ' +
      'Si quieres, dime que cursos aprobaste y te sugiero tu siguiente ciclo.'
  }
];

const quickPrompts = [
  'Quiero mi recomendacion de cursos para el siguiente ciclo.',
  'Explicame los requisitos para Tesis I.',
  'Que cursos puedo llevar si ya aprobe Matematica Discreta?',
];

export default function Assistant() {
  const { selectedMalla, selectedCourses } = useRecommendationStore();
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || sending) return;

    const userMessage = { role: 'user', content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setSending(true);

    try {
      const payload = {
        message: trimmed,
        malla_id: selectedMalla?.id || null,
        cursos_aprobados: selectedCourses?.length ? selectedCourses : null,
      };

      const response = await assistantAPI.chat(payload);
      const assistantMessage = {
        role: 'assistant',
        content: response.data.answer,
        sources: response.data.sources || []
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      toast.error('No se pudo enviar el mensaje. Intenta de nuevo.');
    } finally {
      setSending(false);
    }
  };

  const onKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="max-w-6xl space-y-6">
      <div className="futura-hero text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="futura-chip mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Modo IA
            </div>
            <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
              <MessageSquare className="w-7 h-7" />
              Asistente Academico
            </h1>
            <p className="mt-3 text-sm md:text-base text-white/80 max-w-2xl">
              Haz preguntas sobre reglas, prerequisitos o planificacion. Puedo sugerirte tu proximo ciclo si me das tu avance.
            </p>
          </div>
          <div className="flex flex-col items-start gap-2">
            <Link
              to="/select-courses"
              className="futura-button"
            >
              Recomendar cursos
              <ArrowRight className="w-4 h-4" />
            </Link>
            <span className="text-xs text-white/70">
              Tip: completa tu malla para mejores sugerencias.
            </span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.1fr,0.9fr] gap-5">
        <div className="futura-shell p-5 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-slate-600">
              <Bot className="w-4 h-4" />
              <span className="text-xs uppercase tracking-[0.2em] font-semibold">Chat IA</span>
            </div>
            <span className="futura-chip futura-mono">Gemini 3.5 Flash</span>
          </div>

          <div className="space-y-4 max-h-[480px] overflow-y-auto pr-2">
            {messages.map((msg, index) => (
              <div
                key={`${msg.role}-${index}`}
                className={`futura-message ${
                  msg.role === 'assistant' ? 'futura-message-assistant' : 'futura-message-user'
                }`}
              >
                <div className="text-[11px] uppercase font-semibold text-slate-500 mb-2">
                  {msg.role === 'assistant' ? 'Asistente' : 'Tu'}
                </div>
                <p className="text-slate-800 whitespace-pre-wrap">{msg.content}</p>

                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-4">
                    <div className="text-xs font-semibold text-slate-500 mb-2">Fuentes</div>
                    <div className="space-y-2">
                      {msg.sources.map((source, sourceIndex) => (
                        <div
                          key={`source-${sourceIndex}`}
                          className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl p-3"
                        >
                          <div className="font-semibold text-slate-700">
                            {source.title || source.source || 'Documento'}
                          </div>
                          <div className="mt-1 whitespace-pre-wrap">{source.content}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  className="futura-chip cursor-pointer border-sky-200 bg-sky-50 text-sky-700"
                  onClick={() => setInput(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <textarea
                className="futura-input min-h-[56px] max-h-[140px]"
                placeholder="Escribe tu consulta..."
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={onKeyDown}
                rows={2}
              />
              <button
                onClick={handleSend}
                className="futura-button"
                disabled={sending}
              >
                {sending ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>{sending ? 'Enviando' : 'Enviar'}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="futura-panel">
            <div className="flex items-center space-x-2 mb-2">
              <BookOpenCheck className="w-5 h-5 text-emerald-500" />
              <h3 className="font-semibold text-slate-900">Contexto actual</h3>
            </div>
            <p className="text-sm text-slate-600">
              Malla seleccionada: <strong>{selectedMalla ? selectedMalla.anio : 'No seleccionada'}</strong>
            </p>
            <p className="text-sm text-slate-600">
              Cursos aprobados: <strong>{selectedCourses?.length || 0}</strong>
            </p>
            {!selectedMalla && (
              <p className="text-xs text-slate-500 mt-2">
                Completa tu malla en{' '}
                <Link to="/select-courses" className="text-sky-700 hover:underline">
                  Seleccionar Cursos
                </Link>{' '}
                para respuestas mas precisas.
              </p>
            )}
          </div>

          <div className="futura-panel border border-amber-200 bg-amber-50">
            <div className="flex items-center space-x-2 mb-2 text-amber-700">
              <ShieldAlert className="w-5 h-5" />
              <h3 className="font-semibold">Seguridad</h3>
            </div>
            <p className="text-sm text-amber-800">
              El asistente no pide contrasenas, tokens ni informacion sensible. Si la consulta lo solicita, sera rechazada.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
