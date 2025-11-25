export default interface Transactional {
    "concept": "Transactional", // 产品概念
    "enabled": boolean, // 事务是否生效
    "propagation": "REQUIRED" | "REQUIRES_NEW" | "SUPPORTS" | "NOT_SUPPORTED" | "MANDATORY" | "NEVER", // 事务的传播机制
    "isolation": "DEFAULT" | "READ_UNCOMMITTED" | "READ_COMMITTED" | "REPEATABLE_READ" | "SERIALIZABLE", // 事务的隔离级别
}