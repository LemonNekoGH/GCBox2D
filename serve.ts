const {exec} = require('child_process')

exec('serve . -l 8081',(error: any, stdout: string, stderr: string) => {
    if (error) {
        console.log(`ErrorCode: ${error.code}, ${error.message}\nStack: ${error.stack}`)
    }
    console.log(stdout)
    console.error(stderr)
})

exec('rollup -c -w',(error: any, stdout: string, stderr: string) => {
    if (error) {
        console.log(`ErrorCode: ${error.code}, ${error.message}\nStack: ${error.stack}`)
    }
    console.log(stdout)
    console.error(stderr)
})
