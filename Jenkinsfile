pipeline {
    agent any

    tools {
        nodejs 'NodeJS 24'
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

        stage('Run Playwright Tests transaction') {
            steps {
                sh 'npx playwright test'
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'playwright-report/**', caseSensitive: false, defaultExcludes: false, followSymlinks: false
        }
    }
}
