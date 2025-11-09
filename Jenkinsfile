pipeline {
  agent any

  tools {
    nodejs 'NodeJS v24.10.0'
  }

  stages {

    stage('Checkout') {
      steps { checkout scm }
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

    stage('Deploy to GitHub Pages') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'github-token', usernameVariable: 'GH_USER', passwordVariable: 'GH_TOKEN')]) {
          sh '''
            rm -rf deploy-tmp
            mkdir deploy-tmp
            cp -R dist/* deploy-tmp/
            cd deploy-tmp

            git init
            git config user.name "Anna Kutova"
            git config user.email "annnakutova@gmail.com"
            git add .
            git commit -m "Deploy from Jenkins"

            git branch -M gh-pages

            git remote add origin https://${GH_USER}:${GH_TOKEN}@github.com/krovostcora/diver.git
            git push -f origin gh-pages
          '''
        }
      }
    }
  }
}
