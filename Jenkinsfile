pipeline {
    agent any

    tools {
        nodejs 'NodeJS 24'
    }

    parameters {
        booleanParam(name: 'UPDATE_VISUAL_SNAPSHOTS', defaultValue: false, description: 'Update visual snapshots')
    }

    environment {
        HOME = "${env.WORKSPACE}"
    }

    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Install Browsers') {
            steps {
                sh 'npx playwright install --with-deps'
            }
        }

        stage('Run Playwright Tests') {
            steps {
                script {
                    def cmd = 'npx playwright test'
                    if (params.UPDATE_VISUAL_SNAPSHOTS) {
                        cmd += ' --update-snapshots'
                    }
                    sh cmd
                }
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'playwright-report/**', caseSensitive: false, defaultExcludes: false, followSymlinks: false
        }
    }
}
