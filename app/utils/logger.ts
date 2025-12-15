type LogLevel = 'log' | 'warn' | 'error' | 'info' | 'debug'

interface LoggerConfig {
    enabled: boolean
    levels: LogLevel[]
}

class Logger {
    private config: LoggerConfig

    constructor() {
        const isProduction = process.env.NODE_ENV === 'production' ||
                           (typeof window !== 'undefined' && useRuntimeConfig?.()?.public?.env === 'production')

        this.config = {
            enabled: !isProduction,
            levels: isProduction ? ['error'] : ['log', 'warn', 'error', 'info', 'debug'],
        }
    }

    private shouldLog(level: LogLevel): boolean {
        return this.config.enabled && this.config.levels.includes(level)
    }

    log(...args: any[]): void {
        if (this.shouldLog('log')) {
            console.log(...args)
        }
    }

    warn(...args: any[]): void {
        if (this.shouldLog('warn')) {
            console.warn(...args)
        }
    }

    error(...args: any[]): void {
        if (this.shouldLog('error')) {
            console.error(...args)
        }
    }

    info(...args: any[]): void {
        if (this.shouldLog('info')) {
            console.info(...args)
        }
    }

    debug(...args: any[]): void {
        if (this.shouldLog('debug')) {
            console.debug(...args)
        }
    }

    disable(): void {
        this.config.enabled = false
    }

    enable(): void {
        this.config.enabled = true
    }

    setLevels(levels: LogLevel[]): void {
        this.config.levels = levels
    }
}

export const logger = new Logger()
