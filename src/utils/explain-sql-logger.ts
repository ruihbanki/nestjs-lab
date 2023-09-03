import { AbstractLogger, LogLevel, LogMessage, QueryRunner } from 'typeorm';

export class ExplainSqlLogger extends AbstractLogger {
  protected writeLog(level: LogLevel, logMessage: LogMessage | LogMessage[]) {
    const messages = this.prepareLogMessages(logMessage, {
      highlightSql: false,
    });

    for (const message of messages) {
      switch (message.type ?? level) {
        case 'log':
        case 'schema-build':
        case 'migration':
          console.log(message.message);
          break;

        case 'info':
        case 'query':
          if (message.prefix) {
            console.info(message.prefix, message.message);
          } else {
            console.info(message.message);
          }
          break;

        case 'warn':
        case 'query-slow':
          if (message.prefix) {
            console.warn(message.prefix, message.message);
          } else {
            console.warn(message.message);
          }
          break;

        case 'error':
        case 'query-error':
          if (message.prefix) {
            console.error(message.prefix, message.message);
          } else {
            console.error(message.message);
          }
          break;
      }
    }
  }

  /**
   * Explain sql selects
   */
  async logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    // check queryRunner
    if (!queryRunner) {
      return;
    }

    // if it is explain do nothing, avoid looping
    const isExplain = query.startsWith('EXPLAIN');
    if (isExplain) {
      return;
    }

    // test only selects
    const isSelect = query.startsWith('SELECT');
    if (!isSelect) {
      return;
    }

    // run explain
    const result = await queryRunner.query(`EXPLAIN ${query}`, parameters);
    console.log('\nExplain query: ' + query);
    console.log('Result:', result);
  }
}
