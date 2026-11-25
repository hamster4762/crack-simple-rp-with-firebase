// 데이터구조 v3 변환. 호출 측에서 전체 결과를 원자적으로 저장한다.
export function v2tov3(source, backend) {
  if (source?.schemaVersion !== 2 || source.rooms && (typeof source.rooms !== 'object' || Array.isArray(source.rooms))) {
    throw new Error('데이터구조 2의 원본을 확인할 수 없습니다.');
  }
  const rooms = Object.create(null);
  for (const [key, stored] of Object.entries(source.rooms || {})) {
    rooms[key] = backend === 'firebase'
      ? { meta: stored.meta, ...JSON.parse(stored.data) }
      : stored;
  }
  const previousSettings = backend === 'firebase' && source.settings
    ? { ...JSON.parse(source.settings.data), updatedAt: source.settings.updatedAt }
    : source.settings;
  return {
    schemaVersion: 3,
    rooms,
    settings: previousSettings || { customGuides: {}, guideModes: {}, autoBuildPeriod: 10, updatedAt: 0 },
    presets: {
      library: { items: [], updatedAt: 0 },
      links: {}
    }
  };
}
