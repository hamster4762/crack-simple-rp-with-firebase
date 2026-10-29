// 데이터구조 v2 변환. 호출 측에서 전체 결과를 원자적으로 저장한다.
export function v1tov2(source, backend) {
  if (source?.schemaVersion !== 1 || source.rooms && (typeof source.rooms !== 'object' || Array.isArray(source.rooms))) {
    throw new Error('데이터구조 1의 원본을 확인할 수 없습니다.');
  }
  const rooms = Object.create(null);
  for (const [key, stored] of Object.entries(source.rooms || {})) {
    if (stored?.schemaVersion !== 1) {
      throw new Error(`방 데이터의 구조 버전이 다릅니다: ${key}`);
    }
    const room = backend === 'firebase'
      ? { meta: stored.meta, ...JSON.parse(stored.data) }
      : { ...stored };
    delete room.schemaVersion;
    rooms[key] = room;
  }
  const previousSettings = backend === 'firebase' && source.settings
    ? { ...JSON.parse(source.settings.data), updatedAt: source.settings.updatedAt }
    : source.settings;
  return {
    schemaVersion: 2,
    rooms,
    settings: {
      customGuides: {},
      guideModes: {},
      updatedAt: 0,
      ...previousSettings,
      autoBuildPeriod: 10
    }
  };
}
