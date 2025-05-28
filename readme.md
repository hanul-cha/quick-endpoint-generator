# quick-endpoint-generator

`Quick Endpoint Generator`는 웹 기반 데이터 관리 및 API 엔드포인트 자동 생성 도구입니다. 사용자는 직관적인 UI를 통해 테이블 스키마를 직접 설계하고, 데이터를 추가하며, 각 테이블에 대한 CRUD(생성, 조회, 수정, 삭제) 엔드포인트를 손쉽게 생성하고 실행할 수 있습니다.

## 주요 기능

- **스키마 관리 (Schema Management)**
  - 테이블 생성, 수정, 삭제
  - 각 테이블의 컬럼(필드) 타입 지정 및 관리
  - 테이블별 데이터(행) 추가 및 관리

- **엔드포인트 관리 (Endpoint Management)**
  - 각 테이블에 대한 RESTful API 엔드포인트 생성
  - GET, POST, PUT, DELETE 등 HTTP 메서드 지원
  - 엔드포인트별 파라미터 및 스크립트 커스터마이즈
  - 엔드포인트 테스트 및 실시간 결과 확인

## 스크립트(main 함수) 작성 가이드

엔드포인트의 스크립트는 반드시 `main`이라는 이름의 함수로 작성해야 합니다. 함수 시그니처는 아래와 같습니다:

```js
function main(params, repo) {
  // ...
}
```

- **params**: 엔드포인트에 파라미터(Parameter)를 추가하면, 해당 값들이 `params` 객체로 전달됩니다. 파라미터를 추가/설정하면 자동으로 선택 및 사용이 가능합니다.
- **repo**: 데이터베이스 조작을 위한 저장소 객체입니다. 아래와 같은 구조로 테이블과 행(row)에 대한 다양한 메서드를 제공합니다.

  - `repo.table`: 테이블(스키마) 관련 메서드
    - `findOne(id)`: 특정 테이블을 ID로 조회
    - `findAll(where)`: 모든 테이블 조회 (조건 가능)
    - `find(where, options)`: 조건에 맞는 테이블 목록 조회
    - `create({ name, columns })`: 새 테이블 생성
    - `update(id, data)`: 테이블 정보 수정
    - `delete(where)`: 테이블 삭제

  - `repo.row`: 행(데이터) 관련 메서드
    - `findOne(id)`: 특정 행을 ID로 조회
    - `findAll(where)`: 모든 행 조회 (조건 가능)
    - `find(where, options)`: 조건에 맞는 행 목록 조회
    - `create({ dataTableId, values })`: 새 행 생성
    - `update(id, data)`: 행 정보 수정
    - `updateByWhere(where, data)`: 조건에 맞는 행들 일괄 수정
    - `updateByEntities([{ id, ...properties }])`: 여러 행을 엔티티로 일괄 수정
    - `delete(where)`: 행 삭제

> 함수 이름은 반드시 `main`이어야 하며, 다른 이름을 사용할 경우 정상적으로 동작하지 않습니다.