pipeline {
  agent any

  tools {
    nodejs 'NodeJS v24.10.0'
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install') {
      steps {
        sh 'node -v'
        sh 'npm ci || npm install'
      }
    }

    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }

    stage('Smoke Test') {
      steps {
        sh 'npx cross-port-killer 4173 || true'
        sh 'nohup npm run preview >/dev/null 2>&1 &'
        sh 'sleep 2'
        sh 'npm run smoke'
      }
    }

    stage('Archive') {
      steps {
        archiveArtifacts artifacts: 'dist/**/*', fingerprint: true
      }
    }
  }
}
