export default function OfflinePage() {
  return (
    <main className="flex h-full flex-col justify-center overflow-y-auto px-6 py-10">
      <p className="text-[13px] font-medium text-outline">Persona Chat</p>
      <h1 className="mt-2 text-[26px] font-semibold leading-8">
        연결이 필요합니다
      </h1>
      <p className="mt-3 text-[15px] leading-5.5 text-on-surface-variant">
        오프라인 상태에서는 로그인, 캐릭터 대화, 장기 기억처럼 서버 연결이
        필요한 기능을 사용할 수 없습니다. 네트워크에 연결한 뒤 다시 열어 주세요.
      </p>
    </main>
  );
}
