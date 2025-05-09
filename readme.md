# quick-endpoint-generator

`quick-endpoint-generator`는 웹 기반 데이터 관리 및 API 엔드포인트 자동 생성 도구입니다. 사용자는 직관적인 UI를 통해 테이블 스키마를 직접 설계하고, 데이터를 추가하며, 각 테이블에 대한 CRUD(생성, 조회, 수정, 삭제) 엔드포인트를 손쉽게 생성하고 테스트할 수 있습니다.

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

## 사용 방법

1. **테이블 생성**
   - `Schema Management` 탭에서 `Create Table` 버튼을 클릭하여 새로운 테이블을 생성합니다.
   - 테이블 이름과 컬럼(필드) 이름, 타입을 지정할 수 있습니다.

2. **데이터 추가**
   - 생성된 테이블에 행(row)을 추가할 수 있습니다.

3. **엔드포인트 생성**
   - `Endpoint Management` 탭에서 `Create Endpoint` 버튼을 클릭하여 원하는 엔드포인트를 생성합니다.
   - 엔드포인트 이름, HTTP 메서드, 파라미터, 스크립트 등을 설정할 수 있습니다.
   - **추가한 파라미터가 없다면 fetch가 실패합니다. 현재 모든 파라미터는 필수값입니다.**

4. **엔드포인트 테스트**
   - 생성된 엔드포인트는 바로 `Test` 버튼을 통해 동작을 확인할 수 있습니다.

## 예시

- 테이블 예시
  ```
  table1
    - title: number
    - description: string
  ```

- 엔드포인트 예시
  ```
  Endpoint Name: test2
  HTTP Method: GET
  Script:
    function main(params, repo) {
      console.log('1')
      return repo.table.find()
    }
  Parameter:
    - id: Number
  ```
